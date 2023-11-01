import React, { Component } from "react";
import { Joystick } from "react-joystick-component";
import Config from "../scripts/config";
export class Teleoperation extends Component {
  state = {
    ros: null,
  };
  constructor() {
    super();
    this.init_connection();

    this.handleMove = this.handleMove.bind(this);
    this.handleStop = this.handleStop.bind(this);
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

  handleMove(event) {
    console.log("moving");

    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msg/Twist",
    });

    var Twist = new window.ROSLIB.Message({
      linear: {
        x: event.y/50,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -event.x/50,
      },
    });

    cmd_vel.publish(Twist);
  }

  handleStop() {
    console.log("stopped");

    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });

    var Twist = new window.ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });

    cmd_vel.publish(Twist);
  }

  render() {
    return (
      <>
        <Joystick
          size={100}
          move={this.handleMove}
          stop={this.handleStop}
        ></Joystick>
      </>
    );
  }
}

export default Teleoperation;
