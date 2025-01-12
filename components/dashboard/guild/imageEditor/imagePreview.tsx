export default function ImagePreview({img}: {img: string}) {
  return (
    <div>
      Image Preview
      <img src={img} alt="Generated Image" />
    </div>
  );
}