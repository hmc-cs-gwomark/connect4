import json
import sqlalchemy.types as types
from sqlalchemy.ext.mutable import MutableDict

class TrackableObject(object):
    _type_map = {}

    def __init__(self, *args, **kwds):
        self.parent = None
        super(TrackedObject, self).__init__(*args, **kwds)

    def changed(self):
        if self.parent is not None:
            self.parent.changed()

    @classmethod
    def register(cls, origin_type):
        def decorator(tracked_type):
            cls._type_map[origin_type] = tracked_type
            return tracked_type
        return decorator

    @classmethod
    def convert(cls, obj, parent):
        objtype = type(obj)
        if objtype in cls._type_map:
            newtype = cls._type_map[objtype]
            new = newtype(obj)
            new.parent = parent
            return new
        return obj


@TrackableObject.register(dict)
class TrackedDict(TrackableObject, dict):

    def __setitem__(self, key, value):
        self.changed()
        super(TrackedDict, self).__setitem__(key, self.convert(value, self))

    def __delitem__(self, key):
        self.changed()
        super(TrackedDict, self).__delitem__(key, self.convert(value, self))

    def pop(self, *key):
        self.changed()
        super(TrackedDict, self).pop(*key)

    def popitem(self):
        self.changed()
        return super(TrackedDict, self).popitem()

    def clear(self):
        self.changed()
        super(TrackedDict, self).clear()

    def update(self, source=(), **kwds):
        if source:
            self.changed()
            if isinstance(source, dict):
                source = source.iteritems()
            super(TrackedDict, self).update(
                (key, self.convert(val, self)) for key, val in source)
        if kwds:
            self.update(kwds)

@TrackableObject.register(list)
class TrackedList(TrackableObject, list):
    """A TrackedObject implementation of the basic list."""
    def __setitem__(self, key, value):
        self.changed()
        super(TrackedList, self).__setitem__(key, self.convert(value, self))

    def __delitem__(self, key):
        self.changed()
        super(TrackedList, self).__delitem__(key)

    def append(self, item):
        self.changed()
        super(TrackedList, self).append(self.convert(item, self))

    def extend(self, iterable):
        self.changed()
        super(TrackedList, self).extend(
          self.convert(item, self.parent) for item in iterable)


class JsonEncodedDict(types.TypeDecorator):
    # Specifies the SQLAlchemy alchemy type to be returned
    # by process_bind_param
    impl = types.String

    def process_bind_param(self, value, dialect):
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        return json.loads(value)


class NestedMutableDict(MutableDict, TrackableObject):

    def __setitem__(self, key, value):
        super(NestedMutableDict, self).__setitem__(
            key, self.convert(value, self))

    @classmethod
    def coerce(cls, key, value):
        if isinstance(value, cls):
            return value
        if isinstance(value, dict):
            return cls(value)
        else:
            return super(cls).coerce(key, value)
