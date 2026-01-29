import Image from "next/image";

export default function ImagePreview({ img }: { img: string }) {
  return (
    <div>
      Image Preview
      <Image src={img} alt="Generated Image" width={800} height={350} />
    </div>
  );
}
