import { TextField, Button } from "@mui/material";
import axios from "axios";
import { Formik, Form } from "formik";
import { useCallback, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../../../store/userDetails/selector";
import "./Profile.scss"



export const Profile = () => {
    const userDetails = useSelector(userDetailsSelector);
    const [user, setUser] = useState(userDetails);
    const { username, firstName, lastName, email, phone } = user;

    const fetchUserDetails = useCallback(async () => {
        const response = await axios.get(`http://127.0.0.1:8000/userDetails?id=${userDetails.userId}`);
        const { data } = response;
        setUser(data)
    }, [userDetails.userId]);


    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails])


    return (
        <div className="profile">
            <div className="profile-container">
                <div className="profile-info">
                    <div className="profile-info-header">
                        <div className="profile-info-image">
                            <Avatar googleId={userDetails.userId} src={userDetails.image} size="150" round={true} />
                        </div>
                        <div className="profile-info-name">
                            {firstName || lastName ? <h2>{firstName} {lastName}</h2> : <h2>{username}</h2>}
                        </div>
                    </div>

                    <div className="profile-info-links">
                        <div className="profile-info-link">User Details </div>
                    </div>
                </div>
                <div className="profile-body">
                    <div className="profile-header">
                        <h1>User Details</h1>
                    </div>
                    <div className="profile-body-content">
                        <Formik
                            initialValues={{
                                firstName,
                                lastName,
                                email: email ? email : "",
                                phone: phone ? phone : "",
                                password: ''
                            }}
                            enableReinitialize
                            onSubmit={async (values) => {
                                try {

                                    const updatedDtails = {
                                        ...{
                                            firstName,
                                            lastName,
                                            email,
                                            phone: '',
                                            password: null
                                        }, ...values, userId: userDetails.userId, username
                                    };

                                    console.log(updatedDtails)

                                    const response = await axios.post(`http://127.0.0.1:8000/userDetails`, updatedDtails);
                                    const { data } = response;
                                    setUser(data)

                                } catch (err) {
                                    console.error(err)
                                }
                            }
                            }
                        >
                            {({ handleSubmit, values, handleChange }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="profile-form">
                                        <div className="profile-form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <TextField size='small' type="text" value={values.firstName} name="firstName" id="firstName" placeholder="First Name..." onChange={handleChange} />
                                        </div>
                                        <div className="profile-form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <TextField size='small' value={values.lastName} type="text" name="lastName" id="lastName" placeholder="Last Name..." onChange={handleChange} />
                                        </div>
                                        <div className="profile-form-group">
                                            <label htmlFor="email">Email</label>
                                            <TextField size='small' type="email" value={values.email} name="email" id="email" placeholder="Email..." onChange={handleChange} />
                                        </div>
                                        <div className="profile-form-group">
                                            <label htmlFor="email">Password</label>
                                            <TextField size='small' type="text" name="password" id="password" placeholder="Password..." onChange={handleChange} />
                                        </div>
                                        <div className="profile-form-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <TextField size='small' type="text" value={values.phone} name="phone" id="phoneNumber" placeholder="Phone..." onChange={handleChange} />
                                        </div>
                                        <div className="profile-form-group">
                                            <Button variant='contained' color='primary' size='large' type="submit">Submit</Button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

        </div>
    );
}
