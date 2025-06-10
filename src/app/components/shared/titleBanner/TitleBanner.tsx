interface TitleBannerProps {
  title: string;
  description?: string;
}

function TitleBanner({ title, description }: TitleBannerProps) {
  return (
    <div className="flex flex-col w-full p-6 rounded-2xl bg-[#6B8AFD]">
      <h1 className="font-semibold text-white text-xl">{title}</h1>
      <p className="text-white/75">{description}</p>
    </div>
  );
}

export default TitleBanner;
