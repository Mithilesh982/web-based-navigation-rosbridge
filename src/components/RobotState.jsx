import React, { Component } from 'react'
import Config from "../scripts/config";
import * as Three from "three"

export class RobotState extends Component {

  state ={
    ros: null,
    x:0,
    y:0,
    orientation :0,
    linear_Velocity: 0,
    angular_velocity:0
  }

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection establshed in teleoperation");
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
      console.log("disconnection in teleoperation");
      this.setState({ connected: false });

      setTimeout(() => {
        try {
          this.state.ros.connect(
            "ws//" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
        } catch (error) {
          console.log("error occured : " + error);
        }
      }, Config.RECONNECTION_TIMER);
    });

    try {
      this.state.ros.connect(
        "ws//" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws//" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("error occured : " + error);
    }
  }

  componentDidMount(){
    this.getRobotState();
  }

  getRobotState(){
    var pose_subscriber = new window.ROSLIB.Topic({
      ros:this.state.ros,
      name: Config.POSE_TOPIC,
      messageType:"geometry_msgs/PoseWithCovarianceStamped"
    })
  
    pose_subscriber.subscribe((message)=>{
      this.setState({x: message.pose.pose.position.x.toFixed(2)})
      this.setState({y: message.pose.pose.position.y.toFixed(2)})
      this.setState({orientation : this.getOrientationFromQuaternion(
        message.pose.pose.orientation
      ).toFixed(2)
    })
    })

    var velocity_subscriber = new window.ROSLIB.Topic({
      ros:this.state.ros,
      name: Config.ODOM_TOPIC,
      messageType:"nav_msg/Odometry"
    })

    velocity_subscriber.subscribe((message)=>{
      this.setState({linear_Velocity: message.twist.twist.linear.x.toFixed(2)})
      this.setState({angular_velocity: message.twist.twist.anguar.z.toFixed(2)})
    })
  
  }

  getOrientationFromQuaternion(ros_orientation_quaternion){
    var q= new Three.Quaternion(
      ros_orientation_quaternion.x,
      ros_orientation_quaternion.y,
      ros_orientation_quaternion.z,
      ros_orientation_quaternion.w,
    )

    var RYP = new Three.Euler().setFromQuaternion(q);
    return RYP["_z"] * (180/ Math.PI);

  }
  
  render() {
    return (
      <>
       <h2>Position</h2> 
        <p>x:{this.state.x} </p>
        <p>y:{this.state.y} </p>
        <p>Orientation: {this.state.orientation}</p>

       <h2>Velocity</h2> 
        <p>Linear Velocity : {this.state.linear_Velocity} </p>
        <p>Angular Velocity : {this.state.angular_velocity} </p>

      </>
    )
  }
}

export default RobotState
