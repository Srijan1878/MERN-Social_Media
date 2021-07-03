import { Bookmarks, Group, RssFeed, VideoLibrary } from '@material-ui/icons'
import { Users } from '../../dummyData'
import CloseFriend from '../closefriend/CloseFriend'
import  './sidebar.css'

export default function sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
            <ul className="sidebarList">
                <li className="sidebarListItem">
                    <RssFeed className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                     Feed
                    </span>
                </li>
                <li className="sidebarListItem">
                    <VideoLibrary className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                     Videos
                    </span>
                </li>
                <li className="sidebarListItem">
                    <Bookmarks className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                    Bookmarks
                    </span>
                </li>
                <li className="sidebarListItem">
                    <Group className="sidebarIcon"/>
                    <span className="sidebarListItemText">
                    Groups
                    </span>
                </li>
            </ul>
            <button className="sidebarButton">Show more</button>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendlist">
        {Users.map((user)=>(
            <CloseFriend key={user.id} user={user}/>
        ))}
                </ul>
            </div>
        </div>
    )
}
