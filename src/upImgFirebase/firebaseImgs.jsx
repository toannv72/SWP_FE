import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";


export const firebaseImgs = async (images) => {
  console.log(1111111,images);
    const imagePromises = [];

    for (const image of images) {
      const imageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytes(imageRef, image);
      console.log(image);
      imagePromises.push(uploadTask);
    }

    await Promise.all(imagePromises);

    const imageUrlPromises = images.map(async (image) => {
      const imageRef = ref(storage, `images/${image.name}`);
      return getDownloadURL(imageRef);
    });

    const urls = await Promise.all(imageUrlPromises);
   
    return urls;
};

// const handleImageChanges = (e) => {
//     const selectedImages = e.target.files;
//     setImages([...images, ...selectedImages]);
//   };

// firebaseImgs(images)
// .then((data) => {
//     setImageUrls(data)
// })
// .catch((error) => {
//     console.log(error)
// });