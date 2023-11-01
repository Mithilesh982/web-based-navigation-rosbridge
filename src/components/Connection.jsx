import React, { Component } from "react";
import Config from "../scripts/config";

export class Connection extends Component {
  state = { connected: false, ros: null };

  constructor() {
    super();
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection establshed");
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
      console.log("disconnection");
      this.setState({ connected: false });

      setTimeout(() => {
        try {
          this.state.ros.connect("ws//"+Config.ROSBRIDGE_SERVER_IP+":"+Config.ROSBRIDGE_SERVER_PORT+"");
        } catch (error) {
          console.log("error occured : " + error);
        }
      }, Config.RECONNECTION_TIMER);
    });

    try {
      this.state.ros.connect("ws//"+Config.ROSBRIDGE_SERVER_IP+":"+Config.ROSBRIDGE_SERVER_PORT+"" );
    } catch (error) {
        console.log("ws//"+Config.ROSBRIDGE_SERVER_IP+":"+Config.ROSBRIDGE_SERVER_PORT+"")
      console.log("error occured : " + error);
    }
  }

  render() {
    return (
      <div className="text-center">
        <h6>
          {this.state.connected ? "Robot Connected" : "Robot Disconnected"}
        </h6>
      </div>
    );
  }
}

export default Connection;
