import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../../store/userDetails/selector";
import "./Profile.scss"

export const Profile = () => {

    const userDetails = useSelector(userDetailsSelector);

    return <div className="profile">
        <h1>User Profile</h1>
        
        <p>{userDetails.userName}</p>
        <p>{userDetails.userEmail}</p>


    </div>
}