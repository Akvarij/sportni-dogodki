import {
  PiPersonSimpleBikeLight,
  PiPersonSimpleRunLight,
} from "react-icons/pi";

import TrailRunning from "../../../public/TrailRunning.png";

export default function SportLogo({ logo }: { logo: string }) {
  switch (logo) {
    case "kolo":
      return <PiPersonSimpleBikeLight size={30} />;
    case "trail":
      return (
        <img
          src={TrailRunning}
          alt="Trail Running"
        />
      );
    case "tek":
      return <PiPersonSimpleRunLight size={30} />;
    default:
      return null;
  }
}
