// components/SoundPlayer.js

import { Howl } from "howler";

const playSound = (src: any) => {
  const sound = new Howl({
    src: [src],
  });
  sound.play();
};

export default playSound;
