
import { useLocation } from "react-router-dom";



export const Home = (props)=>{

    const location = useLocation()

    console.log(location.state)

    return(

        <div> 
        <h1>
            {location.state.name}
        </h1>
        <img src={location.state.image}/>
            
        
        </div>
    
    )
}

