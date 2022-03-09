#!/usr/bin/env node
const fs = require('fs')
const path = require('path/win32');
const videoExtensions = require('../lib/video-extensions.json');
const imageExtensions = require('../lib/image-extensions.json');
const thumbnailPath = path.resolve('C:/Users/Sonu/Practice/side_projects/media/thumbnails');
const {spawnSync}  = require('child_process')
var md5 = require("crypto-js/md5");

function exploreRecursiveDFS(_path,exclude){
    let files =[];
    const dfs = (_path)=>{
        if(!isFile(_path) && _path !== exclude){
            for(let file of getCurrentDirectryFiles(_path)){
                    dfs(path.join(_path,file));
            }
        }else{
            files.push(_path);
        }
    }
    dfs(_path);
    return  [...filterImages(files) ]
}

function exploreIterativeBFS(_path,exclude){
    let files = [];
    let queue =[_path];
    while(queue.length>0){
        let p = queue.shift();
        if(!isFile(p) &&p.localeCompare(exclude)!==0){
            for(let file  of getCurrentDirectryFiles(p)){
                    queue.push( path.join(p,file));
            }
        }else{
            files.push(p);
        }
    }
    return  [...filterImages(files) ]
}

function filterImages(files){
    let images = files.filter(file=>{
        const ext = getFileExtension(file);
        return imageExtensions.indexOf(ext) !==-1;
    })
    return images;
}

function getFileExtension(file){
    return path.extname(file).substr(1);
}

function getCurrentDirectryFiles(path){
    let files = fs.readdirSync(path);
    return files;
}

function isFile(path){
    const stat = fs.statSync(path);
    return  stat.isFile();
}


async function createThumbnailImage(file,thumbnailPath){
    return new Promise(async (resolve,reject)=>{
        let fileName = md5(file);
        let dt = spawnSync('magick',['convert',`${file}`, '-thumbnail','200x200^','-gravity','center','-unsharp','0x.7',`${path.join(thumbnailPath,`${fileName}.jpeg`)}`]);
        if(dt.error){
            reject(dt.error);
        }
        resolve({path: `${path.join(thumbnailPath,`${fileName}.jpeg`)}`,name:`${fileName}` });
    })
}

// function getVideoThumbnail(){
//     return new Promise((resolve,reject)=>{
//             const fileName = md5(file);
//             const dt = spawn('ffmpeg',['-i',`${file}`,'-y','-an','-pix_fmt','yuv420p','-vcodec','libx265','-crf','28','-t','3',`${fileName}.mp4`]);
//             dt.stderr.on('data',(data)=>{
//                 console.log(String(data));
//             })
//     });
// }


module.exports = {thumbnailPath, exploreRecursiveDFS,exploreIterativeBFS,filterImages,getCurrentDirectryFiles,isFile,createThumbnailImage};