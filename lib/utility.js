const { Types, Paths } = require("./modals");
const videoExtensions = require('../lib/video-extensions.json');
const imageExtensions = require('../lib/image-extensions.json');

const getType = async (extName)=>{
    let _type = getTypehelper(extName);
    const type = await Types.findOne({
        instance:Types,
        where:{
            name:_type
        }
    })
    return type;
}

const fileExistsInDb = async (hash)=>{
    const count = await Paths.count({
        where:{
            hash:`${hash}`
        }
    })
    return count===0?false:true;
}

const getTypehelper = (extName)=>{
    const ext = extName.substr(1);
    if(videoExtensions.indexOf(ext)!==-1){
        return 'video';
    }
    else if(imageExtensions.indexOf(ext)!==-1){
        return 'image';
    }
    return 'doc';
}
module.exports = {getType,fileExistsInDb};
