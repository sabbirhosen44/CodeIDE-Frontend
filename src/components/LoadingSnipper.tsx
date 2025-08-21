import { FiLoader } from "react-icons/fi";

const LoadingSnipper = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <FiLoader className="size-8 animate-spin mx-auto" />
        <p className="text-lg">{children}</p>
      </div>
    </div>
  );
};

export default LoadingSnipper;
