//----------------//
// ANIMATION CODE //
//----------------//

// const RedCircle = (props) => <div style={props.style} className="red-circle">
//   </div>

// const MovingCircle = (props) => {
//   return (<Motion
//     defaultStyle={{translateX: 0, translateY: 0}}
//     style={{translateX: spring(100, {stiffness:10, damping:48}), translateY: spring(100, {stiffness:10, damping:48})}}>
//     {({translateX, translateY}) =>
//       <RedCircle style={{
//         WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0)`,
//         transform: `translate3d(${translateX}px, ${translateY}px, 0)`
//       }} />
//     }
//   </Motion>)
// }

// class MovingCircle extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       nextCoords: [0, 0]
//     }
//     this.getNewCoords = this.getNewCoords.bind(this);
//   }

//   getNewCoords() {
//     // Get new coordinates and make sure they are within the window
//     // set the nextCoords in the state
//     Math.floor(Math.random() * 20);
//   }

// }

//----------------//
//  END ANIMATION //
//----------------//