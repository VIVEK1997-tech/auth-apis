const fs=require('fs').promises;

const deleteFile=async (path)=>{

    try {

       await fs.unlink(path);
       console.log('User Image deleted successfully');

    }
    catch(error){
        console.log(error.message);
    }

}

module.exports={deleteFile}