import React from 'react';
import {timeConverter} from './helperFunctions'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Bar} from 'react-chartjs-2';

// Description: Render the user's profile
// Props: playerSummary, badges
export const UserProfile = (props) => {
    const playerSummary = props.playerSummary;
    const badges = props.badges;
    const fontStyle = {
        fontSize: "30px",
        fontWeight: "bold"
    };

    // User doesn't exist so cannot get their summary
    if(Object.keys(playerSummary).length === 0)
    {
        return(null);
    }

    // If user isn't the default user, render their profile
    if(playerSummary.steamid !== ""){
        return(
        <Card className="userProfile">
            <Card.Img variant="top" src={playerSummary.avatarfull} />
            <Card.Body>
            <Card.Title id="personName" style={fontStyle}>{playerSummary.personaname}</Card.Title>
            <Card.Link href={playerSummary.profileurl} target="_blank">Steam Profile <FontAwesomeIcon icon={faLink} color="#ecf0f1" /></Card.Link>
            <Card.Text>
                <UserPersonaState personastate={playerSummary.personastate}/>
                <div className="playerDetails">
                    <div>Last Log Off:</div> <span>{timeConverter(playerSummary.lastlogoff)}</span>
                    <br></br>
                    <div>Profile Created:</div> <span>{timeConverter(playerSummary.timecreated)}</span>
                    <br></br>
                    <div>Player Level:</div> <span>{badges.player_level}</span>
                    <br></br>
                </div>
            </Card.Text>
            <div className="progressDiv">
                <div>Exp Progress:</div>       
                <ProgressBar now={(badges.player_xp / (badges.player_xp + badges.player_xp_needed_to_level_up))*100} 
                label={badges.player_xp_needed_to_level_up + "\tneeded to level up"}/>   
            </div>  
            </Card.Body>
        </Card>
        )
    } else {
        return(null);
    }
}
  
// Description: Render the user's friends' summaries
// Props: friendsSummary
export const FriendSummary = (props) => {
    const friendsSummary = props.friendsSummary;

    // User doesn't exist so cannot get friends summaries
    if(friendsSummary.length === 0)
    {
        return(null);
    }

    // User has friends to get summaries from, 
    // otherwise return nothing
    if(friendsSummary[0].steamid !== "")
    {
        return(
        <Accordion defaultActiveKey="1" className="friendsAccordion">
            <Card className="friendsContainer">
            <Card.Header className="accordionHeader">
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                <span>Friends <FontAwesomeIcon icon={faChevronDown} color="#00DFAB" /> </span>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
                <Card.Body className="friendsSummaryBody" style={{overflow: 'auto', height: '620px'}}>
                {friendsSummary.map((friend, i) => {
                    return (
                    <React.Fragment>
                        <Card key={i} className="friendCard">
                        <Image alt="friend profile" src={friend.avatarfull}/>
                        <div classname="friendURL">
                        <a href={friend.profileurl} target="_blank" rel="noopener noreferrer">{friend.personaname}</a>
                        </div>
                        <UserPersonaState personastate={friend.personastate}/>
                        </Card>
                    </React.Fragment>
                    )
                    })}
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion>
        )
    } else {
        return(null);
    }
}
  
// Description: Render a game given the game and appid
// Props: game, appid
export const WishlistGame = (props) => {
    const game = props.game;
    const appid = props.appid;

    if(game.subs.length > 0)
    {
        return(
        <React.Fragment>
            <ListGroup.Item as="li" className="wishlistGame">
            <Image src={game.capsule} />
            <br></br>
            <a href={"https://store.steampowered.com/app/" + appid} target="_blank" rel="noopener noreferrer">{game.name}</a>
            <br></br>
            ${game.subs[0].price / 100}
            </ListGroup.Item>
        </React.Fragment>
        )
    } else {
        return(null);
    }
}

// Description: Render the player's wishlist
// Props: wishlist
export const Wishlist = (props) => {
    const wishlist = props.wishlist;

    // Create the player's wishlist if possible
    if(Object.keys(wishlist).length === 0)
    {
        return(null);
    } else {
        let wishlist_games = [];
        let wishlist_appids = [];
        for(const [key, value] of Object.entries(wishlist)) {
        wishlist_games.push(value);
        wishlist_appids.push(key);
        }

        return (
        <React.Fragment>
            <AccordionComponent classname="wishAccordion" header="Wishlist" body={
            <ListGroup className="wishlistBody" /*style={{overflow: 'auto', height: '500px'}}*/ as="ul" variant="flush">
            {
                wishlist_games.map((game, i) => {
                    return(
                    <WishlistGame game={game} appid={wishlist_appids[i]} key={i}/>
                    )
                })
            }
            </ListGroup>
            }/>
        </React.Fragment>
        )
    }
}

// Description: Render a card to show a player's current status
// Props: personastate
export const UserPersonaState = (props) => {
    const personastate = props.personastate;

    if(personastate === 0) {
        return(
        <Card bg='light' text='dark'>
            <Card.Header>Offline</Card.Header>
        </Card>
        );
    } else if(personastate === 1) {
        return(
        <Card bg='success' text='white'>
        <Card.Header>Online</Card.Header>
        </Card>
        )
    } else if(personastate === 2) {
        return(
        <Card bg='danger' text='white'>
            <Card.Header>Busy</Card.Header>
        </Card>
        )
    } else if(personastate === 3) {
        return(
        <Card bg='warning' text='white'>
            <Card.Header>Away</Card.Header>
        </Card>
        )
    } else if(personastate === 4) {
        return(
        <Card bg='secondary' text='white'>
            <Card.Header>Snooze</Card.Header>
        </Card>
        )
    } else if(personastate === 5) {
        return(
        <Card bg='info' text='white'>
            <Card.Header>Looking to trade</Card.Header>
        </Card>
        )
    } else if(personastate === 6) {
        return(
        <Card bg='primary' text='white'>
            <Card.Header>Looking to play</Card.Header>
        </Card>
        )
    } else {
        return ( 
        null
        )
    }
}

// Description: Render a list of the player's recently played games
// Props: recentlyPlayed
export const RecentlyPlayed = (props) => {
    const recentlyPlayed = props.recentlyPlayed;

    if(recentlyPlayed.total_count > 0)
    {
        return(
        <Accordion className="recentAccordion" defaultActiveKey="0">
            <Card className="recentCard">
            <Card.Header className="accordionHeader">
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    <span>Recently Played <FontAwesomeIcon icon={faChevronDown} color="#00DFAB" /></span>
                    </Accordion.Toggle>
            </Card.Header>

            <Accordion.Collapse eventKey="0">
                <React.Fragment>
                <div className="recentDiv">
                {recentlyPlayed.games.map((game, i) => {
                    return (
                        <Card key={i} className="recentGameCards">
                        <Card.Img variant="top" src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_logo_url + ".jpg"} />
                        <Card.Body>
                            <Card.Title>{game.name}</Card.Title>
                            <Card.Link href={"https://store.steampowered.com/app/" + game.appid + "/"} target="_blank">Steam Store Page</Card.Link>
                        </Card.Body>
                        </Card>
                    )
                })}
                </div>
                </React.Fragment>
            </Accordion.Collapse>
            </Card>
        </Accordion>

        );
    } else {
        return(null);
    }
}

// Description: Render the player's recently played games in the last two weeks
// Props:  games
export const RecentlyPlayedBar= (props) => {
    let games = props.games;
    let ls = games.map(game => game.name);
    let d = games.map((game) => game.playtime_2weeks);

    return(
        <Bar
        data={
            {
            labels: ls,
            datasets: [
                {
                label: "Playtime (Minutes)",
                backgroundColor: ["#007bff", 
                "#ff3648", 
                "#ffbb34",
                "#01c851",
                "#33b5e7",
                "#2abbac",
                "#4385f5",
                "#aa66cd",
                "#34383e",
                "#69727b"
                ],
                data: d
                }
            ]
            }
        }
        options={{
                title:{
                display:true,
                text:'Recently Played Games',
                fontSize:20,
                fontColor: '#ecf0f1'
            },
            legend:{
                labels: {
                    fontColor: '#ecf0f1'
                },
                display:true,
                position:'right'
            },
            scales: {
                xAxes: [{ 
                    gridLines: {
                        display: true,
                        color: '#303853'
                    },
                    ticks: {
                      fontColor: "#FFFFFF",
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: '#303853'
                    },
                    ticks: {
                        fontColor: "#FFFFFF",
                      },
                }],
            }
        }}
        />

    )
}

// Description: Render bar chart for top 10 most played games user owns
// Props: games, gameslist
export const TopTenOwnedGamesBar = (props) => {
    const games = props.games;
    const gameslist = props.gameslist;

    // Sort games array in descending order, grab the top 10, and return an array of the appids
    const ls = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map(game => game.appid);
    // Sort games array in descending order, grab the top 10, and return an array of the playtime since they first played
    const d = games.sort((a,b) => {return b.playtime_forever - a.playtime_forever}).slice(0, 10).map((game) => game.playtime_forever);
    // Loop through and create an array of matching game_names for each appid
    const game_names = new Array(10);
    for(let i = 0; i < gameslist.length; i++)
    {
        for(let j = 0; j < ls.length; j++)
        {
        if(gameslist[i].appid === ls[j])
        {
            game_names[j] = gameslist[i].name;
        }
        }
    }
    return(
        <Bar
        data={
            {
            labels: game_names,
            datasets: [
                {
                label: "Playtime (Minutes)",
                backgroundColor: ["#007bff", 
                "#ff3648", 
                "#ffbb34",
                "#01c851",
                "#33b5e7",
                "#2abbac",
                "#4385f5",
                "#aa66cd",
                "#34383e",
                "#69727b"
                ],
                data: d
                }
            ]
            }
        }
        options={{
            title:{
            display:true,
            text:'Top 10 Owned Games Playtime',
            fontSize:20,
            fontColor: '#ecf0f1'
            },
            legend:{
                labels: {
                    fontColor: '#ecf0f1'
                },
            display:true,
            position:'right'
            },
            scales: {
                xAxes: [{ 
                    gridLines: {
                        display: true,
                        color: '#303853'
                    },
                    ticks: {
                      fontColor: "#FFFFFF",
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        color: '#303853'
                    },
                    ticks: {
                        fontColor: "#FFFFFF",
                      },
                }],
            } 
        }}
        />
    )
}

// Description: Conditionally render user's recentlyPlayed and ownedGame 
//  playtime in charts.
// Props: playerSummary, recentlyPlayed, ownedGames, gamesList
export const SteamStatistics = (props) => {
    const playerSummary = props.playerSummary;
    const recentlyPlayed = props.recentlyPlayed;
    const ownedGames = props.ownedGames;
    const gamesList = props.gamesList;

    // If the user exists, render their charts
    if(playerSummary.steamid !== "" && ownedGames.game_count > 0)
    {
        if(ownedGames.game_count > 0 || recentlyPlayed.total_count > 0)
        {
        if(recentlyPlayed.total_count > 0 && ownedGames.game_count === 0)
        {
            return(
            <AccordionComponent classname="statAccordion" header="Steam Statistics" body={
                <React.Fragment>
                <RecentlyPlayedBar games={recentlyPlayed.games}/>
                </React.Fragment>
            }/>
            );
        } else if(recentlyPlayed.total_count === 0 && ownedGames.game_count > 0) {
            return(
            <AccordionComponent classname="statAccordion" header="Steam Statistics" body={
                <React.Fragment>
                <TopTenOwnedGamesBar games={ownedGames.games} gameslist={gamesList}/>
                </React.Fragment>
            }/>
            );
        } else {
            return(
            <AccordionComponent classname="statAccordion" header="Steam Statistics" body={
                <React.Fragment>
                <RecentlyPlayedBar games={recentlyPlayed.games}/>
                <TopTenOwnedGamesBar games={ownedGames.games} gameslist={gamesList}/>
                </React.Fragment>
            }/>
            );
        }
        } else {
        return(null);
        }
    } else {
        return(null);
    }
}

// Description: A component to make accordion elements easier to use.
// Props: header, body
export const AccordionComponent = (props) => {
    const header = props.header;
    const body = props.body;
    const classname = props.classname;

    return (
        <React.Fragment>
        <Accordion className={classname} defaultActiveKey="0">
            <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                <span>{header} <FontAwesomeIcon icon={faChevronDown} color="#00DFAB" /></span>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
                <Card.Body className="accordionBody">
                {body}
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion>
        </React.Fragment>
    )
}

