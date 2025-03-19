// import the Category model
const categoryModel = require('../models/category');
// Import the room model
const roomModel = require('../models/room');
// Import cloudinary
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { error } = require('console');

exports.createRoom = async(req, res)=>{
    try {
        // Get the category ID from te params
        const {id: categoryId } = req.params;
        // Extract the required fields fro the request body
        const {roomName, price, roomNumber, description } = req.body
        // check if category exists
        categoryExists = await categoryModel.findById(categoryId);
        if (categoryExists == null){
            return res.status(404).json({
                message: 'Category not found'
            })
        }
        // Get the files into a variable
        const file = req.files;
        // Declare an empty array to help hold the results from cloudinary
        const imageArray = [];

        // Handle the image uploading to cloudinary one after th other
        for(const image of file) {
            const result = await cloudinary.uploader.upload(image.path);
            // Delete the image from the local storage
            fs.unlinkSync(image.path);
            // Create the image properties using the result from the cloudinary
            const imageProperties = {
                imageUrl: result.secure_url,
                imageId: result.public_id
            }
            // Push the result object into the initial empty array
            imageArray.push(imageProperties)
        }
        // Create an instance of the document
        const room = new roomModel({
            category: categoryId,
            roomName,
            roomNumber,
            price,
            description,
            images: imageArray
        });
        // Add the new room to the category
        categoryExists.rooms.push(room._id);

        //Save the changes to the documents to the database
        await room.save();
        await categoryExists.save();

        // Send a success response
        res.status(200).json({
            message:"room added successfully",
            data: room
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

exports.deleteRoomImage = async (req, res) => {
    try {

        //Get room and image id from params
        const { id, imageId } = req.params;

        // Check if room exist
        const roomExists = await roomModel.findById(id);
        if (!roomExists) {
            return res.status(404).json({ 
                message: "Room Not Found" 
            });
        }

        const imagePosition = roomExists.images.findIndex(img => img.imageId=== imageId);
        if (imagePosition === -1) {
            return res.status(404).json({ 
                message: "Image Not Found in this Room" 
            });
        }    

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // Remove the image details from the array
        roomExists.images.splice(imagePosition, 1);

        // Save the updated to Database
        await roomExists.save();

        // Return success response
        return res.status(200).json({
            message: "Room image deleted successfully",
            data: roomExists
        });

    } catch (err) {
        console.log(error.message);
        res.status(500).json({ 
            message: "Internal Server Error"
        });
    }
};


exports.updateRoomImage = async (req, res) => {
    try {
        //Get room and image id from params
        const { id, imageId } = req.params;
        // Assuming you're using multer for file uploads
        const file = req.files; 
        if (!file){
             return res.status(400).json({
                 message: "No image uploaded" });
        }
        // Check if room exsits in Database
        const room = await roomModel.findById(id);
        if (!room){ 
            return res.status(404).json({
             message: "Room not found" });
    }
        // Find the image in the array
        const imageIndex = room.images.findIndex(img => img.imageId === imageId);
        if (imageIndex === -1){ 
            return res.status(404).json({
                 message: "Image not found in room" });
}
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path);
        // Delete from local storage
        fs.unlinkSync(file.path); 
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // Update image in the array
        room.images[imageIndex] = {
            imageUrl: result.secure_url,
            imageId: result.public_id
        };

        // Save the updated room document
        await room.save();

        res.status(200).json({
             message: "Image updated successfully",
              data: room 
            });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ 
            message: "Internal server error"
         });
    }
};