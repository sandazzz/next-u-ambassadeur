import Image from "next/image";

export default async function Newspaper() {
  return (
    <div className=" flex justify-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/img/Gazette Oct 2024.avif"
        width={500}
        height={500}
        priority={false}
        alt="Image de la gazette"
      ></Image>
    </div>
  );
}
