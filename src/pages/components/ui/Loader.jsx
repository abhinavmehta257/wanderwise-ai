const Loader = () => {
  return (
    <div className="fixed flex-col inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      <video
        src="/loader.webm"
        autoPlay
        loop
        muted
        playsInline
        className="sm:[50%] lg:w-[20%] aspect-1"
      />
      <p className="text-black">Please wait...</p>
    </div>
  );
};

export default Loader;