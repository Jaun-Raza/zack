import "../styles/ex.css";

function Faq() {
  return (
    <div className="flex justify-center items-center text-white custom-height">
      <div className="pri">
        <h2 className="font-bold">FAQ</h2>
        <br />
        <p>
          <h4>What is Picto?</h4>
          Picto is an image sharing host that allows you to upload and share
          images with the world.
          <br />
          <br />
          <h4>Where can I view my uploaded images?</h4>
          Once registered, you can view your uploaded images by selecting
          "Recently uploaded Images" on the top right, and then selecting "My
          Images" in the top middle of your screen. You can choose to keep your
          images private or make them public.
          <br />
          <br />
          <h4>What's the maximum upload size I can upload?</h4>
          The maximum upload size we allow is 50MB per image.
          <br />
          <br />
          <h4>How can I report a photo?</h4>
          If you need to report a photo, simply email us at help@picto.gg.
          Please include the image link and details regarding the issue you're
          reporting.
          <br />
          <br />
          <h4>Can I delete my photo?</h4>
          You currently cannot delete photos, however you can public and private
          them whenever you'd like when you have an account.
        </p>
      </div>
    </div>
  );
}

export default Faq;
