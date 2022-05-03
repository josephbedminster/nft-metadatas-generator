const fs = require("fs"),
    path = require("path"),
    basePath:string = process.cwd(),
    config =  require(path.join(basePath, "/src/config.js")),
    attributesDir:string = path.join(basePath, "/src/attributes/"),
    buildDir:string = path.join(basePath, "/build");

execute();

async function execute() {
    try {
        let filenames: string[] = await listAttributesFiles(attributesDir);
        let files: AttributeFactory[] = await loadAttributesFiles(filenames);
        for (let i: number = 0; i < config.MAX_SIZE; i++) {
            let attributes: Attributes = generateAttributes(files);
            writeMetadataFile(i, attributes);
        }
        console.log(`✅ Generated ${config.MAX_SIZE} NFTs metadatas ! Available in /build/jsons/ folder.`);
    } catch(e) {
        console.log("🚧 Failed.", e)
    }
}

function writeMetadataFile(i:number, attributes: Attributes) {
    let json = {
        id: i,
        name: attributes.find(el => el.trait_type == "Name")?.value,
        description: config.DESCRIPTION,
        image: config.IPFS_URI + `${i}.png`,
        date: new Date().getTime(),
        authors: config.AUTHORS,
        contributors: config.CONTRIBUTORS,
        season: config.SEASON,
        attributes: attributes
    }
    fs.writeFileSync(
        `${buildDir}/jsons/${i}`,
        JSON.stringify(json, null, 2)
    );
}

function generateAttributes(files: AttributeFactory[]): Attributes {
    let attributes: Attributes = [];
    for (let item of files) {
        let rand:number = getRandom(1, 100);
        let name: string = getAttributeName(item.filename);
        if (rand <= item.json.rate) {
            let value:string = generateStat(item.json)
            attributes.push(new Attribute(name, value))
        } else {
            attributes.push(new Attribute(name, "None"))
        }
    }
    return attributes;
}

function generateStat(el: any) {
    let str: string = '';
    if (el.hasOwnProperty("elements")) {
        if (el.hasOwnProperty("prefix")) {
            let n0: number = getRandom(1, el.prefix.elements.length - 1);
            str += el.prefix.elements[n0] + " ";
        }
        let n: number = getRandom(1, el.elements.length - 1);
        str += el.elements[n];
        if (el.hasOwnProperty("suffix")) {
            let n2: number = getRandom(1, el.suffix.elements.length - 1);
            str += " " + el.suffix.elements[n2];
        }
    } else if (el.hasOwnProperty("range")) {
        str = String(getRandom(el.range.min, el.range.max));
        if (el.hasOwnProperty("unit")) {
            str += " " + el.unit;
        }
    } else if (el.hasOwnProperty("random-string")) {
        str = String(generateRandomString(el["random-string"]));
    } else {
        str = "";
    }
    return str;
}


function generateRandomString(length: number) {
    const c:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result:string = '';
    for (let i:number = 0; i < length; i++) {
        result += c.charAt(Math.floor(Math.random() * c.length));
    }
    return result;
}


async function loadAttributesFiles(filenames: string[]) {
    let files: AttributeFactory[] = [];
    for (const filename of filenames) {
        let json = await fs.promises.readFile(attributesDir + filename, 'utf8');
        try {
            json = JSON.parse(json);
        } catch(e) {
            console.log("Failed at parsing JSON file: ", filename)
            json = null;
        }
        files.push({"filename": filename, "json": json})
    }
    return files;
}
async function listAttributesFiles(attributesDir: string) {
    return await fs.promises.readdir(attributesDir);
}

function getAttributeName(filename: string): string {
    let str: string = filename;
    str = str.replace(/\.json/gmi, '');
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
}

function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

interface Attribute {
    trait_type: string;
    value: string;
}


interface AttributeFactory {
    filename: string;
    json: any;
}

class Attribute {
    trait_type: string;
    value: string;

    constructor(trait_type: string, value: string) {
        this.trait_type = trait_type;
        this.value = value;
    }
}

type Attributes = Array<Attribute>;
