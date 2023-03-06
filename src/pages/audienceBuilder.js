import React, { Fragment } from 'react';
import withAuth from '../hoc/withAuth';
import { Link } from 'react-router-dom';

class AudienceBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audienceBuilder: [
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_art.jpg',
                    title: 'Art',
                    handle: 'art',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Art Magazines</h3>
                            <ul>
                                <li>Art Monthly</li>
                                <li>ARTnews Magazine</li>
                                <li>ArtReview</li>
                                <li>Artsy</li>
                                <li>Frieze (magazine)</li>
                                <li>American Art Collector Magazine</li>
                                <li>Artists And Illustrators Magazine</li>
                                <li>The Artist</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Events & Galleries</h3>
                            <ul>
                                <li>Affordable Art Fair</li>
                                <li>Frieze Art Fair</li>
                                <li>National Gallery</li>
                                <li>Saatchi Gallery</li>
                                <li>Serpentine Galleries</li>
                                <li>Tate</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Artists</h3>
                            <ul>
                                <li>Sarah Lucas</li>
                                <li>Keith Haring</li>
                                <li>Richard Serra</li>
                                <li>Gerhard Richter</li>
                                <li>Banksy</li>
                                <li>Andy Warhol</li>
                                <li>Jeff Koons</li>
                                <li>Keith Harring</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul> 
                                <li>Acrylic paint</li>
                                <li>Arts, Artists, Artwork</li>
                                <li>Design Sketching</li>
                                <li>Drawing Club</li>
                                <li>Figure drawing</li>
                                <li>Landscape painting</li>
                                <li>Pencil Sketch</li>
                                <li>Portrait painting</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_beach-holiday-swimwear.jpeg',
                    title: 'Beach/Holiday/Swimwear',
                    handle: 'beach-holiday-swimwear',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Holiday Companies</h3>
                            <ul>
                                <li>TUI Travel</li>
                                <li>Thomas Cook</li>
                                <li>Jet2.com</li>
                                <li>Lastminuite.com</li>
                                <li>MakeMyTrip.com</li>
                                <li>AirBnB</li>
                                <li>On The Beach Holidays</li>
                                <li>Carnival Cruise Line</li>
                            </ul>      
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Beach Life</li>
                                <li>Beach Party</li>                     
                                <li>Bikini Beach</li>
                                <li>Holiday</li>
                                <li>I LOVE THE BEACH</li>
                                <li>Summer</li>
                                <li>Summer vacation</li>
                                <li>One-piece swimsuit</li>             
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Swimwear Brands</h3>
                            <ul> 
                                <li>ACACIA SWIMWEAR</li>
                                <li>Beach Bunny Swimwear</li>
                                <li>Dangerous Curves Swimwear</li>
                                <li>San Lorenzo Bikinis</li>
                                <li>VEVE Glamour Swimwear</li>
                                <li>Khongboon Swimwear</li>             
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Beauty.jpeg',
                    title: 'Beauty',
                    handle: 'beauty',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Holiday Companies</h3>
                            <ul>
                                <li>ELLE</li>
                                <li>Allure</li>
                                <li>Vogue</li>
                                <li>Glamour</li>
                                <li>InStyle</li>
                                <li>Lucky</li>
                            </ul>   
                        </div>
                        <div class="column column_3_12">
                            <h3>Websites</h3>
                            <ul>
                                <li>Vogue Runway</li>
                                <li>The Fashion Spot</li>
                                <li>Fashinista</li>
                                <li>StyleCaster</li>
                                <li>Salon Fixer</li>
                                <li>Total Beauty</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Community</h3>
                            <ul> 
                                <li>Hairstylist Themes</li>
                                <li>Make-Up &amp; Hair Tutorials</li>
                                <li>Style Me Pretty</li>
                                <li>Amazing Hairstyles</li>
                                <li>Makeup &amp; Hair</li>  
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Stores</h3>
                            <ul> 
                                <li>Superdrug</li>
                                <li>The Body Shop</li>
                                <li>Walgreens</li>
                                <li>Beauty Bay</li>
                                <li>Ulta Beauty</li>
                                <li>SEPHORA</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul> 
                                <li>Pixiwoo</li>
                                <li>Marlena</li>
                                <li>MakeUpTiffanyD</li>
                                <li>Goss MakeUp Artist</li>
                                <li>Lisa Elfridge</li>
                                <li>Zoella</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Brands</h3>
                            <ul> 
                                <li>Mac Cosmetics</li>
                                <li>NYX Professional MakeUp</li>
                                <li>NARS Cosmetics</li>
                                <li>Chanel</li>
                                <li>Avon</li>
                                <li>Garnier</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Birds.jpeg',
                    title: 'Birds',
                    handle: 'birds',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Charities</h3>
                            <ul>
                                <li>World Parrot Trust</li>
                                <li>Seattle Audubon Society</li>
                                <li>American Bird Conservancy</li>
                                <li>American Birding Association</li>
                            </ul>      
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Pages</h3>
                            <ul>
                                <li>I Love Birds</li>
                                <li>LoveBird</li>
                                <li>Wild Birds</li>
                                <li>Exotic Bird</li>
                                <li>Cockatoo</li>
                                <li>Parrot</li>
                                <li>Parrot Humor</li>         
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul> 
                                <li>Birding (magazine)</li>
                                <li>Birds &amp; Blooms Magazine</li>
                                <li>Birdwatch (magazine)</li>
                                <li>Parrot Magazine</li>           
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Buddhism.jpeg',
                    title: 'Buddhism',
                    handle: 'buddhism',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Community</h3>
                            <ul>
                                <li>Meditation Masters</li>
                                <li>Love - Zen - Buddhism</li>
                                <li>Tao &amp; Zen</li>
                                <li>Fractal Enlightenment</li>
                                <li>Buddhahood</li>
                            </ul>      
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Karmapa</li>
                                <li>Barry Kerzin</li>
                                <li>Robert Thurman</li>
                                <li>Dzogchen Ponlop Rinpoche</li>
                                <li>Guru Rinpoche</li>       
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Publishers</h3>
                            <ul> 
                                <li>Lion's Roar</li>
                                <li>The Mindfulness Bell</li>
                                <li>Tibetan Buddhism - Snow Lion and Shambhala Publications</li>
                                <li>Mother Jones</li>       
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Websites</h3>
                            <ul> 
                                <li>Lion's Roar</li>
                                <li>The Mindfulness Bell</li>
                                <li>Tibetan Buddhism - Snow Lion and Shambhala Publications</li>
                                <li>Mother Jones</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Butterflies.jpeg',
                    title: 'Butterflies',
                    handle: 'butterflies',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul class="list-group list-group-flush">
                                <li>A Butterfly Boutique</li>
                                <li>Butterfly</li>
                                <li>Butterfly Conservation</li>
                                <li>Butterfly gardening</li>
                                <li>Butterfly Lovers</li>
                                <li>Butterfly World</li>             
                            </ul>    
                        </div>
                        <div class="column column_3_12">
                            <h3>Nature & Wildlife Popular Audience</h3>
                            <ul>
                                <li>BBC Wildlife</li>
                                <li>Birds &amp; Blooms Magazine</li>
                                <li>Nature and wildlife photography</li>
                                <li>Nature photography</li>
                                <li>Wildlife photography</li>
                                <li>National Geographic (magazine)</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Cars.jpeg',
                    title: 'Cars',
                    handle: 'cars',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Used Car Sites</h3>
                            <ul>
                                <li>Auto Trader (UK)</li>
                                <li>AutoGuide.com</li>
                                <li>Autotrader</li>
                                <li>Autotrader CarsDirect.com</li>
                                <li>We Buy Any Car</li>
                                <li>Auto Express</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Fredric Aasbø</li>
                                <li>Stacey David</li>
                                <li>Chris Forsberg</li>
                                <li>Ken Block</li>
                                <li>Street Beast "DOC"</li>
                                <li>Heavy D</li>
                                <li>Farmtruck & ANZ</li>
                                <li>Murder Nova</li>
                                <li>Lewis Hamilton</li>
                                <li>Michael Schumacher</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>TV Shows</h3>
                            <ul>
                                <li>The Grand Tour</li>
                                <li>Top Gear BBC America</li>
                                <li>Street Outlaws</li>
                                <li>Pimp My Ride</li>
                                <li>Mighty Car Mods</li>
                                <li>Graveyard Carz</li>
                                <li>Fast 'N' Loud</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Products/Services</h3>
                            <ul>
                                <li>The Grand Tour</li>
                                <li>Top Gear BBC America</li>
                                <li>Street Outlaws</li>
                                <li>Pimp My Ride</li>
                                <li>Mighty Car Mods</li>
                                <li>Graveyard Carz</li>
                                <li>Fast 'N' Loud</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Magazine</h3>
                            <ul>
                                <li>Modified Magazine</li>
                                <li>Chevy High Performance</li>
                                <li>Truckin' Magazine</li>
                                <li>Hot Rod Magazine</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Cats.jpeg',
                    title: 'Cats',
                    handle: 'cats',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Pet Supplies</h3>
                            <ul>
                                <li>Pets At Home</li>
                                <li>Pets Corner</li>
                                <li>PetSmart</li>
                                <li>Petco</li>
                                <li>Pet Supplies</li>
                                <li>Pet Barn</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Charities</h3>
                            <ul>
                                <li>Blind Cat Rescue and Sanctuary Inc.</li>
                                <li>Karma Rescue</li>
                                <li>Cats Protection</li>
                                <li>A Shelter Friend</li>
                                <li>Shelter Pet Project</li>
                                <li>RSPCA</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Cats: Media</h3>
                            <ul>
                                <li>The Catnip Times</li>
                                <li>Pussington Post</li>
                                <li>The Cattington Post</li>
                                <li>Wonderful Cats</li>
                                <li>Cat Lady Land</li>
                                <li>ANIML</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Morris The 9Lives Cat</li>
                                <li>Homer Blind Wonder Cat</li>
                                <li>Monty</li>
                                <li>Cole & Marmalade</li>
                                <li>Jackson Galaxy</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Christianity.jpeg',
                    title: 'Christianity',
                    handle: 'christianity',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Music / Bands</h3>
                            <ul>
                                <li>Casting Crowns</li>
                                <li>Hillsong Worship</li>
                                <li>Jeremy Camp</li>
                                <li>MercyMe</li>
                                <li>Skillet (band)</li>
                                <li>Third Day</li>
                                <li>TobyMac</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>News / Blogs</h3>
                            <ul>
                                <li>Christian Today</li>
                                <li>Crosswalk.com</li>
                                <li>Faith.com</li>
                                <li>iBelieve.com</li>
                                <li>Praise.com</li>
                                <li>Women Of Faith</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Bible Study Magazine</li>
                                <li>CCM Magazine</li>
                                <li>Charisma (magazine)</li>
                                <li>Christianity Today</li>
                                <li>Relevant (magazine)</li>
                                <li>Risen Magazine</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Cleaning.jpeg',
                    title: 'Cleaning',
                    handle: 'cleaning',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Laundry Brands</h3>
                            <ul>
                                <li>Laundry detergent</li>
                                <li>OxiClean</li>
                                <li>Purex (laundry detergent)</li>
                                <li>OxiClean</li>
                                <li>Persil</li>
                                <li>Tide (brand)</li>
                                <li>Vanish (brand)</li>
                                <li>Surf</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Cleaning Brands</h3>
                            <ul>
                                <li>Clorox</li>
                                <li>Dettol</li>
                                <li>Lysol</li>
                                <li>Febreeze</li>
                                <li>Mr. Clean</li>
                                <li>Windex</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Carpet Cleaning</li>
                                <li>Cleaning</li>
                                <li>Floor Cleaning</li>
                                <li>Housekeeping</li>
                                <li>Spring Cleaning</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Cooking.jpg',
                    title: 'Cooking',
                    handle: 'cooking',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Bon Appetit</li>
                                <li>Cooking Light</li>
                                <li>Eating well</li>
                                <li>Fine Cooking</li>
                                <li>Gourmet</li>
                                <li>Tast Of Home</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>TV Shows</h3>
                            <ul>
                                <li>Chefs Life</li>
                                <li>Chopped</li>
                                <li> Hell's Kitchen</li>
                                <li>Iron Chef</li>
                                <li>MasterChef</li>
                                <li>The Great British Bake OFf</li>
                                <li>Top Chef</li>
                                <li>Food Network</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Pages</h3>
                            <ul>
                                <li>BuzzFeed Food</li>
                                <li>Easy Home Meals</li>
                                <li>Foodie</li>
                                <li>I Love Cooking</li>
                                <li>Tastemade</li>
                                <li>Tasty</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Gordan Ramsay</li>
                                <li>Hairy Bikers</li>
                                <li>James Martin</li>
                                <li>Jamie Oliver</li>
                                <li>Marco Pierre White</li>
                                <li>Nigella Lawson</li>
                                <li>Raymond Blanc</li>
                                <li>Rick Stein</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Bloggers</h3>
                            <ul>
                                <li>Naturally Ella</li>
                                <li>Minimalist Baker</li>
                                <li>My New Roots</li>
                                <li>The First Mess</li>
                                <li>Palea</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Baking Magazines</h3>
                            <ul>
                                <li>Cooking & Pastry</li>
                                <li>Bake From Scratch</li>
                                <li>Cake And Bake</li>
                                <li>Sweet Paul Magazine</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Couples.jpeg',
                    title: 'Couples',
                    handle: 'couples',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Demographics</h3>
                            <ul>
                                <li>Engaged</li>
                                <li>In a Relationship</li>
                                <li>Friends of newly engaged people</li>
                                <li>Newly engaged (1 year)</li>
                                <li>Married</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audience</h3>
                            <ul>
                                <li>Romance (love)</li>
                                <li>love quotes</li>
                                <li>Love & Sex</li>
                                <li>Love</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Cycling.jpeg',
                    title: 'Cycling',
                    handle: 'cycling',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Bicycling (magazine)</li>
                                <li>Bike (magazine)</li>
                                <li>Cycling Weekly</li>
                                <li>Cyclingnews.com</li>
                                <li>Pro Cycling</li>
                                <li>Rouleur (magazine)</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Bicycle commuting</li>
                                <li>Bike-to-Work Day</li>
                                <li>Cycle sport</li>
                                <li>Cycling club</li>
                                <li>CyclingTips</li>
                                <li>I Love Cycling</li>
                                <li>Racing bicycle</li>
                                <li>Ride To Work</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Media/Websites</h3>
                            <ul>
                                <li>Drunkcyclist.com</li>
                                <li>Bikerumor.com</li>
                                <li>Singletracks.com - Mountain Bike Trails & Reviews</li>
                                <li>PeopleForBikes.org</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Clothing</h3>
                            <ul>
                                <li>Cycling Gear</li>
                                <li>Après Vélo</li>
                                <li>Champion System</li>
                                <li>Santini Cycling Wear</li>
                                <li>GiroSportsDesign</li>
                                <li>Salsa Cycles</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Retail</h3>
                            <ul>
                                <li>November Bicycles</li>
                                <li>Road Bike Action</li>
                                <li>Wiggle</li>
                                <li>Competitive Cyclist</li>
                                <li>The Pro's Closet</li>
                                <li>Bicycle World</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_DIY_-_Life_Hacks.jpeg',
                    title: 'DIY/LIFE HACKS',
                    handle: 'diy-life-hacks',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Popular Pages</h3>
                            <ul>
                                <li>Creative Crafts</li>
                                <li>DIY & Craft Ideas</li>
                                <li>Creative Ideas</li>
                                <li>Handmade Things</li>
                                <li>DIY & Crafts</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Life Hacks</h3>
                            <ul>
                                <li>Lifehacks</li>
                                <li>Life Hacking</li>
                                <li>Parent Hacks</li>
                                <li>Lifehacker</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Dogs.jpeg',
                    title: 'Dogs',
                    handle: 'dogs',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Pet Supplies</h3>
                            <ul>
                                <li>Pets At Home</li>
                                <li>Pets Corner</li>
                                <li>PetSmart</li>
                                <li>Petco</li>
                                <li>Pet Supplies</li>
                                <li>Pet Barn</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Dog Charities</h3>
                            <ul>
                                <li>Dogs Trust</li>
                                <li>A Place To Bark</li>
                                <li>RSPCA</li>
                                <li>Shelter Pet Project</li>
                                <li>Karma Rescue</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Fan Pages</h3>
                            <ul>
                                <li>I Love Dogs</li>
                                <li>Life Is Better With A Dog</li>
                                <li>I Love Rescue Dogs</li>
                                <li>Life Paws</li>
                                <li>Dog Lovers Club</li>
                                <li>I Love My Dog</li>
                                <li>You Love Your Dog</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Norbert</li>
                                <li>Cesar Millan</li>
                                <li>2 Travelling Dogs</li>
                                <li>Nigella The Pug</li>
                                <li>Minnie & Max The Pugs</li>
                                <li>Manny The Frenchie</li>
                                <li>Frank The Frenchie</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Fishing.jpeg',
                    title: 'Fishing',
                    handle: 'fishing',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>American Angler Magazine</li>
                                <li>Angling Times</li>
                                <li>CARPology Magazine</li>
                                <li>Carpworld Magazine</li>
                                <li>Sport Fishing Magazine</li>
                                <li>Marlin Magazine</li>
                                <li> Fishing Magazines</li>
                                <li>On The Water Magazine</li>
                                <li>In-Fisherman</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>Team Bottom Dwellers Tackle</li>
                                <li>Berkley Fishing</li>
                                <li>TackleDirect</li>
                                <li>PENN Fishing</li>
                                <li>Shakespeare Fishing</li>
                                <li>Bomber Lures</li>
                                <li>13 Fishing</li>
                                <li>Quantum Fishing</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>TV Shows</h3>
                            <ul>
                                <li>LindnersAnglingEdge</li>
                                <li>Extreme Angler TV</li>
                                <li>The ITM Fishing Show</li>
                                <li>Jimmy Houston</li>
                                <li>ZONA's Awesome Fishing Show!</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Fitness.jpg',
                    title: 'Fitness',
                    handle: 'fitness',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Men's Fitness</li>
                                <li>Health & Fitness Magazine</li>
                                <li>Flex (magazine)</li>
                                <li>Muscle & Fitness</li>
                                <li>GQ</li>
                                <li>BoxLife Magazine</li>
                                <li>Shape (magazine)</li>
                                <li>Men's Health (magazine)</li>
                                <li>Women's Health & Fitness Magazine</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Events & Organisation</h3>
                            <ul>
                                <li>CrossFit</li>
                                <li>Eat - Fit - Fuel</li>
                                <li>Tough Mudder</li>
                                <li>The Color Run</li>
                                <li>Spartan</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Apps</h3>
                            <ul>
                                <li>MyFitnessPal</li>
                                <li>Fitbit</li>
                                <li>Couch-To-5k Running Plan</li>
                                <li>Garmin Fitness</li>
                                <li>RunKeeper</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Gyms</h3>
                            <ul>
                                <li>LifeTime.Life</li>
                                <li>Golds Gym</li>
                                <li>Planet Fitness</li>
                                <li>Nuffield Health</li>
                                <li>Bannatynes Gym</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Gaming.jpeg',
                    title: 'Gaming',
                    handle: 'gaming',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>GameStop</li>
                                <li>Game</li>
                                <li>CeX</li>
                                <li>Loot Crate</li>
                                <li>g2a.com</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Garden.jpg',
                    title: 'Garden',
                    handle: 'garden',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>House & Garden (magazine)</li>
                                <li>Gardeners' World</li>
                                <li>Country Life (magazine)</li>
                                <li>Better Homes and Gardens (magazine)</li>
                                <li>Fine Gardening</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Garden centre</li>
                                <li>Gardening Know How</li>
                                <li>Gardening Tips</li>
                                <li>Home and garden</li>
                                <li>I Love Gardening</li>
                                <li>Love Your Garden</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Golf.jpeg',
                    title: 'Golf',
                    handle: 'golf',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Bubba Watson</li>
                                <li>Dustin Johnson</li>
                                <li>Jordan Spieth</li>
                                <li>Rickie Fowler</li>
                                <li>Rory McIlroy</li>
                                <li>Sergio García</li>
                                <li>Tiger Woods</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Events / Championships</h3>
                            <ul>
                                <li>Masters Tournament</li>
                                <li>PGA Championship</li>
                                <li>PGA European Tour</li>
                                <li>PGA Tour</li>
                                <li>Ryder Cup</li>
                                <li>U.S. Open (golf)</li>
                                <li>The Open Championship</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Golf Magazine</h3>
                            <ul>
                                <li>Golf Digest</li>
                                <li>Golf Magazine</li>
                                <li>Golf Tips Magazine</li>
                                <li>Golfweek</li>
                                <li>Today's Golfer</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Clothing</h3>
                            <ul>
                                <li>Odyssey Golf</li>
                                <li>Golf Pride</li>
                                <li>PUMA Golf</li>
                                <li>Adidas Golf</li>
                                <li>YETI</li>
                                <li>Bridgestone Golf</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Gothic_Fashion.jpeg',
                    title: 'Gothic Fashion',
                    handle: 'gothic-fashion',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Clothing Brands</h3>
                            <ul>
                                <li>Black Milk Clothing</li>
                                <li>Disturbia Clothing</li>
                                <li>Iron Fist Clothing</li>
                                <li>Moonmaiden Gothic Clothing</li>
                                <li>WORNSTAR CLOTHING</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Homeware_-Home_Decor.jpeg',
                    title: 'Homeware/Home Decor',
                    handle: 'homeware-home-decor',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Decor Home Ideas</li>
                                <li>Home And Garden</li>
                                <li>Home Decoration & Design</li>
                                <li>Decor Home Ideas</li>
                                <li>Ideas For Your Home</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Better Homes</li>
                                <li>Dwell</li>
                                <li>Elle Decor</li>
                                <li>House & Garden</li>
                                <li>House Beautiful</li>
                                <li>Ideal Home</li>
                                <li>Home Design</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Homeware Retailers</h3>
                            <ul>
                                <li>The Home Depot</li>
                                <li>Dunelm</li>
                                <li>Homebase</li>
                                <li>The Range</li>
                                <li>Ikea</li>
                                <li>Homesense</li>
                                <li>Pottery Barn</li>
                                <li>Lowe's Home Improvement</li>
                                <li>Matalan</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Hunting.jpeg',
                    title: 'Hunting',
                    handle: 'hunting',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>TV Shows</h3>
                            <ul>
                                <li>Primos Hunting </li>
                                <li>Drury Outdoors</li>
                                <li>Backwoods Life</li>
                                <li>Michael Waddell's Bone Collector</li>
                                <li>Savage Outdoors TV</li>
                                <li>Beyond The Hunt TV</li>
                                <li>Raised Hunting</li>
                                <li>Heartland Bowhunter</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Hunting Brands</h3>
                            <ul>
                                <li>Mossay Oak</li>
                                <li>Under Armour Hunt</li>
                                <li>Sitka Gear</li>
                                <li>String Stalker</li>
                                <li>Kryptek Outdoor Group</li>
                                <li>Convergent Hunting Solutions</li>
                                <li>HuntVault</li>
                                <li>Muley Freak</li>
                                <li>OnX Hunt</li>
                                <li>KUIU</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Fred Eichler - Fan Page</li>
                                <li>Jase Roberts</li>
                                <li>Willie Robertson</li>
                                <li>Jim Shockey</li>
                                <li>Cameron Hanes</li>
                                <li>Jim Shockey</li>
                                <li>Michael Waddell</li>
                                <li>Steven Rinella - MeatEater</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Hunting</li>
                                <li>Eastmans' Hunting Journals</li>
                                <li>Outdoor Life</li>
                                <li>Field & Stream</li>
                                <li>Outside </li>
                                <li>The Field</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Jewelry.jpeg',
                    title: 'Jewelry',
                    handle: 'jewelry',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>Kay Jewelers</li>
                                <li>PANDORA</li>
                                <li>H.Samuel</li>
                                <li>Warren James Jewellers</li>
                                <li>Tiffany & Co.</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Badass Jewelry</li>
                                <li>Beautiful Jewellery</li>
                                <li>I Love Jewellery</li>
                                <li>Kick-Ass Jewellery</li>
                                <li> Jewellery Online Shopping</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Kids_-_Toys.jpeg',
                    title: 'Kids/Toys',
                    handle: 'kids-toys',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Toy Brands</h3>
                            <ul>
                                <li>Lego</li>
                                <li>Fisher-Price</li>
                                <li>Barbie</li>
                                <li>Playskool</li>
                                <li>MATTEL</li>
                                <li>Play-Doh</li>
                                <li>LeapFrog</li>
                                <li>Hasbro</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Kids Magazines</h3>
                            <ul>
                                <li>National Geographic Kids</li>
                                <li>The Beano</li>
                                <li>ZooBooks</li>
                                <li>Quiz Kids  </li>
                                <li>DiscoveryBox</li>
                                <li>Aquila</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Kids TV</h3>
                            <ul>
                                <li>Disney Junior </li>
                                <li> Nickelodeon</li>
                                <li>  Phineas y Ferb </li>
                                <li>Drake & Josh</li>
                                <li> Boomerang </li>
                                <li>Cartoon Network</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Toy Stores</h3>
                            <ul>
                                <li>Smyths Toy Superstores</li>
                                <li>Toys R Us</li>
                                <li>US Toys</li>
                                <li>Build-A-Bear</li>
                                <li>Hawkins Bazar</li>
                                <li>Hamelys</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Men_s_Fashion.jpeg',
                    title: 'Men\'s Fashion',
                    handle: 'men-s-fashion',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Esquire</li>
                                <li>GQ</li>
                                <li>The Gentlemen's Journal</li>
                                <li>Another Magazine</li>
                                <li>Arena Hommes</li>
                                <li>Fantastic Man</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Fashion & Style for Men</li>
                                <li>Men Style Fashion</li>
                                <li>Men's Fashion</li>
                                <li>Men's Style & Grooming</li>
                                <li>The Alpha Male</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Retail/Brands</h3>
                            <ul>
                                <li>Topman</li>
                                <li>Burton</li>
                                <li>Ralph Lauren</li>
                                <li>Calvin Klein</li>
                                <li>Hollister Co.</li>
                                <li>Armani</li>
                                <li>Gucci</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Motorcycles.jpeg',
                    title: 'Motorcycles',
                    handle: 'motorcycles',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Biker Magazines</h3>
                            <ul>
                                <li>BIKER Magazine</li>
                                <li>Easyriders Magazine</li>
                                <li>Fast Bike Magazine</li>
                                <li>Motorcyclist Magazine</li>
                                <li>Rider Magazine</li>
                                <li>Superbike Magazine</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Motorcycle Brands</h3>
                            <ul>
                                <li>Harley Davidsons</li>
                                <li>Honda Motorcycles</li>
                                <li>Kawasaki motorcycles</li>
                                <li>Triumph Motorcycles</li>
                                <li>Yamaha Motor Company</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Motorcycle Fan Pages</h3>
                            <ul>
                                <li>Biker World</li>
                                <li>BIKERS</li>
                                <li>I Love Motocross</li>
                                <li>Motocross is my life</li>
                                <li>Motorcycle racing</li>
                                <li>Harley Owners Club</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Music.jpeg',
                    title: 'Music',
                    handle: 'music',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Music Festivals</h3>
                            <ul>
                                <li>Bestival</li>
                                <li>Boomtown</li>
                                <li>Burning Man</li>
                                <li>Coachella Valley Music and Arts Festival</li>
                                <li>Glastonbury Festival</li>
                                <li>Tomorrowland (festival)</li>
                                <li>V Festival</li>
                                <li>Wireless Festival</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Headphones</h3>
                            <ul>
                                <li>Beats</li>
                                <li>Bose headphones</li>
                                <li>Headphones</li>
                                <li>JBL</li>
                                <li>Sennheiser</li>
                                <li>Skullcandy</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazine</h3>
                            <ul>
                                <li>Clash (magazine)</li>
                                <li>Kerrang!</li>
                                <li>Mojo (magazine)</li>
                                <li>Musician (magazine)</li>
                                <li>Q magazine</li>
                                <li>Uncut (magazine)</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Natural_-_Health.jpeg',
                    title: 'Natural/Health',
                    handle: 'natural-health',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Organic Food</h3>
                            <ul>
                                <li>Abel & Cole</li>
                                <li>Blue Apron</li>
                                <li>FreshDirect</li>
                                <li>Graze</li>
                                <li>HelloFresh</li>
                                <li>NatureBox</li>
                                <li>Riverford</li>
                                <li>Sun Basket</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Organic Product</h3>
                            <ul>
                                <li>100% Pure</li>
                                <li>Juice Beauty</li>
                                <li>Lavera Organic Skin Care</li>
                                <li>Organic Beauty</li>
                                <li>Physicians Formula</li>
                                <li>Goop</li>
                                <li>J.R. Watkins Naturals</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Health (magazine)</li>
                                <li>Men's Health (magazine)</li>
                                <li>Self (magazine)</li>
                                <li>Women's Health (magazine)</li>
                                <li>Women's Health (magazine)</li>
                                <li>Living Healthy</li>
                                <li>Prevention Magazine</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Medical Medium</li>
                                <li>Dr. Josh Axe </li>
                                <li>Sandi Krakowski</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Outdoor_-_Survival.jpeg',
                    title: 'Outdoor/Survival',
                    handle: 'outdoor-survival',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>National Geographic Traveller</li>
                                <li>Travel & Leisure</li>
                                <li>Conde Nast Traveler</li>
                                <li>Field And Stream</li>
                                <li>Backpacker</li>
                                <li>Outdoor Life</li>
                                <li>Survival Magazine</li>
                                <li>Backpacker (magazine)</li>
                                <li>Blue Ridge Outdoors Magazine</li>
                                <li>The Great Outdoors (magazine)</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Blogs</h3>
                            <ul>
                                <li>Beyond The Tent</li>
                                <li>Outdoors Geej</li>
                                <li>Currently Wandering </li>
                                <li>Gr8 Lakes Camper</li>
                                <li>Brian's Backpacking Blog</li>
                                <li>All The Camping Gear</li>
                                <li>Off-the-grid</li>
                                <li>James Wesley Rawles</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Equipment Brands</h3>
                            <ul>
                                <li>Adventura</li>
                                <li>Force Ten</li>
                                <li>Hilleberg</li>
                                <li>Nemo</li>
                                <li>Exped</li>
                                <li>Hilleberg</li>
                                <li>Nemo</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Clothing Brands</h3>
                            <ul>
                                <li>Moutain Warehouse</li>
                                <li>The North Face</li>
                                <li>Blacks.co.uk</li>
                                <li>REI</li>
                                <li>Backcountry</li>
                                <li>Bass Pro Shops</li>
                                <li>Under Armour</li>
                                <li>Grunt Style</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Parents_-_Babies.jpeg',
                    title: 'Parents/Babies',
                    handle: 'parents-babies',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Parenting Magazines</h3>
                            <ul>
                                <li>Parent Magazine</li>
                                <li>Parents</li>
                                <li>Parenting Magazine</li>
                                <li>Family Circle</li>
                                <li>Child</li>
                                <li>Mothering</li>
                                <li>Hip Mama</li>
                                <li>First Eleven </li>
                                <li>Primary Times</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Parenting Blogs/Sites</h3>
                            <ul>
                                <li>Cafemom.com</li>
                                <li>Parents.com</li>
                                <li>Parenting.com</li>
                                <li>Bundoo.com</li>
                                <li>CoParents.com</li>
                                <li>TheCradle.com</li>
                                <li>Newborns Planet</li>
                                <li>Mothering.com</li>
                                <li>Pluggedinparent</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Baby Brand</h3>
                            <ul>
                                <li>Huggies</li>
                                <li>Johnson's Baby</li>
                                <li>Mothercare</li>
                                <li>Pampers</li>
                                <li>Chicco</li>
                                <li>Fisher-Price</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Baby Popular Keywords</h3>
                            <ul>
                                <li>Baby bottle</li>
                                <li>Baby monitor</li>
                                <li>Breastfeeding</li>
                                <li>Diaper bag</li>
                                <li>Infant formula</li>
                                <li>Nappy</li>
                                <li>Pacifier</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Photography_-_Camera.jpeg',
                    title: 'Photography/Camera',
                    handle: 'photography-camera',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>LensGiant</li>
                                <li>BorrowLenses.com</li>
                                <li>Manfrotto</li>
                                <li>KEH Camera</li>
                                <li>Adorama</li>
                                <li>B&H Photo Video Pro Audio</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Sue Bryce Photographer </li>
                                <li>Rachel Brenke</li>
                                <li>Tamara Lackey Photography</li>
                                <li>Jerry Ghionis</li>
                                <li>Erin Tole Photography</li>
                                <li>Kara May Photography</li>
                                <li>Meg Borders</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>I Love Photography</li>
                                <li>Photography Club</li>
                                <li>Photography On Facebook</li>
                                <li>CreativeLive</li>
                                <li>Pure Love Photography</li>
                                <li>CRAVE PHOTOGRAPHY</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Blogs/Websites</h3>
                            <ul>
                                <li>The Savvy Photographer</li>
                                <li>Million Dollar Photographer</li>
                                <li>FStoppers</li>
                                <li>DIYPhotography </li>
                                <li>SLR Lounge</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Behind The Shutter</li>
                                <li>Leamonade and Lenses</li>
                                <li>Digital Photo Pro Magazine</li>
                                <li>PDN</li>
                                <li>Amateur Photographer</li>
                                <li>Shutterbug Magazine</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Sailing.jpeg',
                    title: 'Sailing',
                    handle: 'sailing',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Boating (magazine)</li>
                                <li>Cruising World Magazine</li>
                                <li>SAIL Magazine</li>
                                <li>SAILING Magazine</li>
                                <li>Yachting (magazine)</li>
                                <li>Yachts and Yachting Magazine</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Community / Events</h3>
                            <ul>
                                <li>2017 America's Cup</li>
                                <li>International America's Cup Class</li>
                                <li>International Sailing Federation</li>
                                <li>Interscholastic Sailing Association</li>
                                <li>Royal Yachting Association</li>
                                <li>Sailing at the Summer Olympics</li>
                                <li>Volvo Ocean Race</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Clothing / Retail</h3>
                            <ul>
                                <li>Gill</li>
                                <li>Helly Hansen</li>
                                <li>Musto (company)</li>
                                <li>North Sails</li>
                                <li>Sailing World</li>
                                <li>Sea</li>
                                <li>Yachting World</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Science_-_Space.jpg',
                    title: 'Science/Space',
                    handle: 'science-space',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Organisations</h3>
                            <ul>
                                <li>NASA</li>
                                <li>SpaceX</li>
                                <li>The Planetary Society</li>
                                <li>NASA Solar System Exploration</li>
                                <li>ESA – European Space Agency</li>
                                <li>International Space Station</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Fan Pages</h3>
                            <ul>
                                <li>LiveScience</li>
                                <li>Space.com</li>
                                <li>Mysterious Universe</li>
                                <li>The Skeptics’ Guide to the Universe</li>
                                <li>I fucking love science</li>
                                <li>Science Lovers Only</li>
                                <li>The Science Bible</li>
                                <li>Science Insider</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Skiing_-_Snowboarding.jpg',
                    title: 'Skiing/Snowboarding',
                    handle: 'skiing-snowboarding',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>Freeskier Magazine</li>
                                <li>SKI Magazine</li>
                                <li>Skiing Magazine</li>
                                <li>Snowboard Magazine</li>
                                <li>Snowboarder Magazine</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Skiing Clothing Brands</h3>
                            <ul>
                                <li>Arc'teryx</li>
                                <li>Helly Hansen</li>
                                <li>Kari Traa</li>
                                <li>Mountain Hardwear</li>
                                <li>Oakley Inc.</li>
                                <li>Patagonia (clothing)</li>
                                <li>The North Face</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Aksel Lund Svindal</li>
                                <li>Alberto Tomba</li>
                                <li>Bode Miller</li>
                                <li>Danny Davis (snowboarder)</li>
                                <li>Jamie Anderson (snowboarder)</li>
                                <li>Jenny Jones (snowboarder)</li>
                                <li>Shaun White Snowboarding</li>
                                <li>Ted Ligety</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Famous Ski Resorts</h3>
                            <ul>
                                <li>Arapahoe Basin</li>
                                <li>Chamonix</li>
                                <li>Courchevel</li>
                                <li>Keystone Resort</li>
                                <li>Les Deux Alpes</li>
                                <li>Les Trois Vallées</li>
                                <li>Steamboat Ski Resort</li>
                                <li>Val Thorens</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Soccer.jpeg',
                    title: 'Soccer',
                    handle: 'soccer',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Public Figures/Players</h3>
                            <ul>
                                <li>Cristiano Ronaldo</li>
                                <li>David Beckham</li>
                                <li>Garest Bale</li>
                                <li>Lionel Messi</li>
                                <li>Neymar</li>
                                <li>Sergio Ramos</li>
                                <li>Wayne Rooney</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>FourFourTwo</li>
                                <li>Kicker </li>
                                <li>Match</li>
                                <li>World Soccer</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Organizations</h3>
                            <ul>
                                <li>FIFA World Cup</li>
                                <li>La Liga</li>
                                <li>Premier LEague</li>
                                <li>UEFA</li>
                                <li>UEFA Champions League</li>
                                <li>UEFA Europa League</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Teams</h3>
                            <ul>
                                <li>FC Barcelona</li>
                                <li>Chelsea FC</li>
                                <li>Liverpool FC</li>
                                <li>Manchester City FC</li>
                                <li>Manchester United FC</li>
                                <li>Real Madrid CF</li>
                                <li>Tottenham Hotspur FC</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Superheroes_-_Comics.jpeg',
                    title: 'Superheroes/Comics',
                    handle: 'superheroes-comics',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Superheroes</h3>
                            <ul>
                                <li>Aquaman</li>
                                <li>Batman</li>
                                <li>Iron Man</li>
                                <li>Justice League</li>
                                <li>Spider-Man</li>
                                <li>Superman</li>
                                <li>Wonder Woman</li>
                                <li>The Avengers</li>
                                <li>Deadpool</li>
                                <li>Suicide Squad</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Comi</h3>
                            <ul>
                                <li>DC Comics</li>
                                <li>Marvel Comics</li>
                                <li>Dark Horse Comics</li>
                                <li>Comic Book</li>
                                <li>ComiXology</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Blogs / Media Websites</h3>
                            <ul>
                                <li>ThinkGeek</li>
                                <li>The Nerdist</li>
                                <li>SuperHeroHype</li>
                                <li>Geek.com</li>
                                <li>ComicBookMovie.com</li>
                                <li>Comicbook.com</li>
                                <li>BuzzFeed Geeky</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Comic Book Artists</h3>
                            <ul>
                                d<li>Stan Lee</li>
                                <li>Jack Kirby</li>
                                <li>Todd Mcfarlane</li>
                                <li>Jim Lee</li>
                                <li>Neil Gaiman</li>
                                <li>Alan Moore</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Super-Hero Movies</h3>
                            <ul>
                                <li>Batman Returns</li>
                                <li>Deadpool (film)</li>
                                <li>Logan</li>
                                <li>Spider-Man (2002 film)</li>
                                <li>The Avengers 2012</li>
                                <li>The Dark Knight (film)</li>
                                <li>X-Men: The Last Stand</li>
                                <li>Iron Man (2008 film)</li>
                                <li>Thor (film)</li>
                                <li>Hulk (film)</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Tech.jpeg',
                    title: 'Tech',
                    handle: 'tech',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Blogs</h3>
                            <ul>
                                <li>Tech Radar</li>
                                <li>Nerdist</li>
                                <li>Mashable</li>
                                <li>Tech</li>
                                <li>Digital Trends</li>
                                <li>Wired</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Electronic Retailers</h3>
                            <ul>
                                <li>Anker</li>
                                <li>Newegg</li>
                                <li>Conrad Electronic</li>
                                <li>Currys</li>
                                <li>PC World</li>
                                <li>Euronic</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Coolest Gadgets</li>
                                <li>Gadget</li>
                                <li>Gadget And Gear</li>
                                <li>Gadget Geeks</li>
                                <li>Latest Technology</li>
                                <li>Smart Technology</li>
                            </ul>
                        </div>
                        <div class="column column_3_12">
                            <h3>Youtube Channels</h3>
                            <ul>
                                <li>Android Authority</li>
                                <li>Marques Brownlee</li>
                                <li>The Verge</li>
                                <li>UnboxTherapy</li>
                                <li>CNET</li>
                            </ul>
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>Phone Brands</h3>
                            <ul>
                                <li>HTC</li>
                                <li>Huawei</li>
                                <li>iPhone</li>
                                <li>LG Mobile</li>
                                <li>Motorola</li>
                                <li>Nokia</li>
                                <li>OnePlus</li>
                                <li>Windows Phone</li>
                            </ul>
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Tennis.jpeg',
                    title: 'Tennis',
                    handle: 'tennis',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>Tennis Warehouse</li>
                                <li>Tennis Express</li>
                                <li>PlayYourCourt</li>
                                <li>Prince Tennis</li>
                                <li>TENNIS.com</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Andy Murray</li>
                                <li>Roger Federer</li>
                                <li>Novak Djokovic</li>
                                <li>Rafa Nadal</li>
                                <li>Serena Williams</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Tools.jpg',
                    title: 'Tools',
                    handle: 'tools',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Tool Brands</h3>
                            <ul>
                                <li>Milwaukee Tools</li>
                                <li>Dewalt</li>
                                <li>Ridgid Tools</li>
                                <li>Channellock</li>
                                <li>Hilti North America</li>
                                <li>Bosch Professional Power Tools </li>
                                <li>Makita</li>
                                <li>Rockwell</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Media/News</h3>
                            <ul>
                                <li>On The Tools</li>
                                <li>DIY & Crafts</li>
                                <li>Nifty Outdoors</li>
                                <li>Better Homes & Gardens</li>
                                <li>Craft</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Tools Retail</h3>
                            <ul>
                                <li>B&Q</li>
                                <li>The Home Depot</li>
                                <li>Wickes</li>
                                <li>Lowes Home Improvement</li>
                                <li>Dunelm</li>
                                <li>Homebase</li>
                                <li>Ace Hardware</li>
                                <li>Screwfix</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Websites</h3>
                            <ul>
                                <li>DIY Craft Projects</li>
                                <li>DIY Home Decorating</li>
                                <li>Ideal Home</li>
                                <li>Hometalk</li>
                                <li>Crafty Morning</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12 clear">
                            <h3>TV</h3>
                            <ul>
                                <li>DIY Network</li>
                                <li>HGTV</li>
                                <li>DIY SOS</li>
                                <li>The Project</li>
                                <li>60 Minuites</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Travel.jpeg',
                    title: 'Travel',
                    handle: 'travel',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>I love to travel</li>
                                <li>Love to Travel</li>
                                <li>Travel Adventures</li>
                                <li>Travel All Over The World</li>
                                <li>Travel the World</li>
                                <li>Trip & Travel Blog</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Airlines</h3>
                            <ul>
                                <li>Air France</li>
                                <li>American Airlines</li>
                                <li>British Airways</li>
                                <li>EasyJet</li>
                                <li>Etihad Airways</li>
                                <li>Qatar Airways</li>
                                <li>Ryanair</li>
                                <li>Turkish Airlines</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Hotels/Accommodation</h3>
                            <ul>
                                <li>Airbnb</li>
                                <li>Booking.com</li>
                                <li>Expedia (website)</li>
                                <li>Hotels.com</li>
                                <li>Trivago</li>
                                <li>Travelodge</li>
                                <li>Hotel Ibis</li>
                                <li>Holiday Inn</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Behaviour - Frequent Travellers</h3>
                            <ul>
                            
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Unicorns.jpg',
                    title: 'Unicorns',
                    handle: 'unicorns',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Popular Pages</h3>
                            <ul>
                                <li>Team Unicorn</li>
                                <li>The Unicorns</li>
                                <li>Unicorn</li>
                                <li>I Love Unicorns</li>
                                <li>Unicorn (Dungeons & Dragons)</li>
                                <li>Unicorn Kid</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Watches.jpeg',
                    title: 'Watches',
                    handle: 'watches',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Brands</h3>
                            <ul>
                                <li>Pulsar</li>
                                <li>Tissot</li>
                                <li>OMEGA Watches</li>
                                <li>Movado</li>
                                <li>TAG Heuer</li>
                                <li>ROLEX</li>
                                <li>Longines</li>
                                <li>Casio</li>
                                <li>Tommy Hilfiger </li>
                                <li>Hugo Boss Watches</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Retailers</h3>
                            <ul>
                                <li>Ernest Jones</li>
                                <li>H. Samuel</li>
                                <li>Carl F. Bucherer - Fine Swiss Watchmaking</li>
                                <li>Watch World</li>
                                <li>World Of Watches</li>
                                <li>Luxury Watches</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Wedding.jpeg',
                    title: 'Wedding',
                    handle: 'wedding',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Wedding Magazines</h3>
                            <ul>
                                <li>Bridal Guide Magazine</li>
                                <li>Bride Magazine</li>
                                <li>Brides (magazine)</li>
                                <li>Wedding Ideas magazine</li>
                                <li>Wedding magazine</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Community</h3>
                            <ul>
                                <li>Before the Big Day</li>
                                <li>The Wedding Shop by Shutterfly</li>
                                <li>Dreamwedding</li>
                                <li>My Dream Wedding</li>
                                <li>Wedding Selections</li>
                                <li>The Knot</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Retail / Services</h3>
                            <ul>
                                <li>Weddingstar Inc.</li>
                                <li>Wedding Forward</li>
                                <li>Bez Ambar Wedding Rings Engagement Rings and Fine Jewelry</li>
                                <li>A Practical Wedding</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Wolves.jpeg',
                    title: 'Wolves',
                    handle: 'wolves',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Charities</h3>
                            <ul>
                                <li>California Wolf Center</li>
                                <li>Endangered Wolf Center</li>
                                <li>Lakota Wolf Preserve</li>
                                <li>Wild Spirit Wolf Sanctuary</li>
                                <li>Wolf Conservation Center</li>
                                <li>Wolf Education & Research Center (WERC)</li>
                                <li>Living With Wolves</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Wolf Breeds</h3>
                            <ul>
                                <li>Gray Wolf</li>
                                <li>White Wolf</li>
                                <li>Red Wolf</li>
                                <li>Mexican Gray Wolves</li>
                                <li>Black Wolf</li>
                                <li>Wolfdog</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Women_s_Fashion.jpeg',
                    title: 'Women\'s Fashion',
                    handle: 'women-s-fashion',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Instagram Bloggers</h3>
                            <ul>
                                <li>Song Of Style </li>
                                <li>She Wears Fashion</li>
                                <li>Susanna Lau</li>
                                <li>The Blonde Salad</li>
                                <li>The Man Repeller</li>
                                <li>Margaret Zhang</li>
                                <li>Fashion Bloggers</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Popular Audiences</h3>
                            <ul>
                                <li>Fashion & Dresses</li>
                                <li>Fashion Is My Life</li>
                                <li>Fashion Trends & Style</li>
                                <li>Trendy Fashion</li>
                                <li>Women's fashion</li>
                                <li>WOMAN Fashion</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
                {
                    imgSrc: 'https://cdn.shopify.com/s/files/1/2865/2146/files/ab_Yoga.jpeg',
                    title: 'Yoga',
                    handle: 'yoga',
                    pageContent: `
                    <div class="grid">
                        <h2>Targeting Suggestions</h2>
                        <p>Copy & paste these targets into the "targeting" section of your ad sets in Facebook. For best results mix two or three lists. Each time you have entered a list, click "narrow audience" and then add the contents of the next list. If your product is in more than one niche, you could mix some of those lists with these lists to really pinpoint your target audience.</p>
                        <div class="column column_3_12">
                            <h3>Retail</h3>
                            <ul>
                                <li>YogaOutlet.com</li>
                                <li>Spiritual Gangster</li>
                                <li>Yoga Rebel</li>
                                <li>YOGAAccessories.com</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Magazines</h3>
                            <ul>
                                <li>OM Yoga & Lifestyle Magazine</li>
                                <li>Yoga Magazine</li>
                                <li>LA YOGA Magazines</li>
                                <li>Yoga Journel</li>
                                <li>Yoga Today</li>
                                <li>Yoga International</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Community</h3>
                            <ul>
                                <li>YogaGlo</li>
                                <li>Bandha Yoga - The Scientific Keys</li>
                                <li>Well+Good</li>
                                <li>Yoga Inspiration</li>
                                <li>Meditation Masters</li>
                            </ul> 
                        </div>
                        <div class="column column_3_12">
                            <h3>Public Figures</h3>
                            <ul>
                                <li>Kathryn Budig</li>
                                <li>Kris Carr</li>
                                <li>The Betty Rocker</li>
                                <li>Karina Elle</li>
                            </ul> 
                        </div>
                    </div>
                    `
                },
            ]
        }
    }

    render() {
        return (
            <Fragment>
                <div className="grid page-container">
                    <h1></h1>
                    <div className="text-center">
                        <h1>Audience Builder</h1>
                    </div>
                    {this.state.audienceBuilder.map((data,i) => {
                        return (
                            <div className="column column_3_12" key={i}>
                                <div className="product-card">
                                    <div className="product-details text-center" style={{padding:0}}>
                                        <Link to={{
                                            pathname: "/audience-builder/"+data.handle+"/"+data.title.replace(/\//g,"-"),
                                            state:{
                                                pageContent: data.pageContent
                                            }}} className="stretch-width">
                                            <div className="product-tumb" style={{backgroundImage: "url(" +  data.imgSrc  + ")", borderRadius: '10px 10px 0 0' }}>
                                            </div>
                                            {/* <img src={data.imgSrc} className="stretch-width" style={{height: '200px'}} /> */}
                                            <div className="ab-text">
                                                {data.title}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}

export default withAuth(session => session && session.getCurrentUser)(AudienceBuilder);