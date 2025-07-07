import SignupContainer from "./components/signup-container";
import SignupCover from "./components/signup-cover";

export default function Signup() {
  return (
    <div className="flex-1 flex bg-white">
      <div className="flex-1 hidden lg:block">
        <SignupCover />
      </div>
      <div className="flex-1">
        <SignupContainer />
      </div>
    </div>
  );
}
