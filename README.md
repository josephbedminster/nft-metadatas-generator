# NFTs Metadatas generator
![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)
#### Description

Easily prepare all your metadatas with random attributes based on references for your image generation.
Example : you need to create 10,000 NFT-planets. You will need to set up each property (diameter, type, ressources,...) and their rate drop.
This engine will help to generate it easily, and will give you all .JSON metadatas ERC721-compliant files (compatible with Opensea, LooksRare,...).
You will need to generate your media (svg, png, video) separately.

#### Example

##### Universe project : Planets NFTS

Generating 10,000 poly planets.

![Planets](https://i.imgur.com/JzObLMx.jpg)

Output metadatas generated :

![Planets](https://i.imgur.com/5XXIopK.png)


#### Preparing your attributes

##### Attribute description

In `/src/attributes`, create one `.json` file per attribute

![Planets](https://i.imgur.com/yAy944T.png)

In each attribute file, you can specify a list of items, or a numeric range.
The `rate` key determines the probability of the attribute occurring (`rate: 5` gives 5% chance of drop).

![Planets](https://i.imgur.com/UCHqpvH.png)


### Run the script
##### Install:
`npm i`

##### Run:
`npm run start`


