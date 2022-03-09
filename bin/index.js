#!/usr/bin/env node
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
const md5 = require("crypto-js/md5");
const {exploreIterativeBFS, thumbnailPath, createThumbnailImage} = require('../lib/script')
const fs = require('fs');
const path = require('path/win32');
const { getType, fileExistsInDb } = require("../lib/utility");
const { Paths, Thumbnails, Files, cleanDatabase, Types } = require("../lib/modals");
async function main(){
    // await cleanDatabase();
    const cwd = process.cwd();
    let files = exploreIterativeBFS(cwd,thumbnailPath);
        for(file of files){
            const filehash = md5(file);
            const exists = await fileExistsInDb(filehash);
            if(!exists){
            // genertae thumbnail
                const thumbnail = await createThumbnailImage(file,thumbnailPath);
                const thumbnailHash = md5(thumbnail.path);
                const fileThumbnailPath = await Paths.create({path:thumbnail.path,hash:`${thumbnailHash}`});
                const _thumbnail = await Thumbnails.create({pathId:fileThumbnailPath.get('id')});
                const filePath = await Paths.create({path:file,hash:`${filehash}`});
                const fileType = await getType(path.extname(file));
                const stat = fs.statSync(file);
                const File =await  Files.create({
                    name:file,
                    size:stat.size,
                    pathId:filePath.get('id'),
                    typeId:fileType.get('id'),
                    thumbnailId:_thumbnail.get('id')
                })
                console.log(File.get('name'),'added');
            }
        }
}


main()