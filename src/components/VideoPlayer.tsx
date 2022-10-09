import { useState } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProp {
  style?: object;
  width: string;
  height: string;
  url: string;
  className?: string;
}

const VideoPlayer= ({
  style,
  width,
  height,
  url,
  className
}: VideoPlayerProp) => {
  return (
    <ReactPlayer
      className={'react-player ' + className}
      url={url}
      width={width}
      height={height}
      style={style}
      controls={true}
      id={"player"}
    />
  );
}

export default VideoPlayer;
