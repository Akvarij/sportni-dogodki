import {
  PiPersonSimpleBikeLight,
  PiPersonSimpleRunLight,
} from "react-icons/pi";

import { TbSwimming } from "react-icons/tb";

import TrailRunning from "../../../public/TrailRunning.png";
import Triatlon from "../../../public/Triatlon.png";

export default function SportCategory({ category }: { category: string }) {
  switch (category) {
    case "kolo":
      return <PiPersonSimpleBikeLight size={30} />;
    case "plavanje":
      return <TbSwimming size={30} />;
    case "trail":
      return <img src={TrailRunning} alt="Trail Running" />;
    case "tek":
      return <PiPersonSimpleRunLight size={30} />;
    case "triatlon":
      return <img src={Triatlon} alt="Triatlon" />;
    default:
      return null;
  }
}
