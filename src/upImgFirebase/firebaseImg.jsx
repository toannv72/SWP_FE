import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../configs/firebase";


export const firebaseImg = async (image) => {
    if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        // Tải ảnh lên Firebase Storage
        await uploadBytes(imageRef, image);
        // Lấy đường dẫn URL của ảnh
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
    }
    return null;
};

    // Xử lý khi người dùng chọn một tệp hình ảnh
    // const handleImageChange = (e) => {
    //     const selectedImage = e.target.files[0];
    //     setImage(selectedImage);
    // };

    
    // firebaseImg(image)
    //         .then((data) => {
    //             setImageUrl(data)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         });