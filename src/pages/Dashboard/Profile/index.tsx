import React, { useEffect } from "react";

// hooks
import { useProfile, useRedux } from "../../../hooks/index";
import { userModel } from "../../../redux/auth/types";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import MyProfile from "./MyProfile";
import UserDescription from "./UserDescription";
import Media from "../../../components/Media";
import AttachedFiles from "../../../components/AttachedFiles";

// actions
import { getProfileDetails } from "../../../redux/actions";

interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { profileDetails, getProfileLoading, isProfileFetched } =
    useAppSelector(state => ({
      profileDetails: state.Profile.profileDetails,
      getProfileLoading: state.Profile.getProfileLoading,
      isProfileFetched: state.Profile.isProfileFetched,
    }));
  const user: userModel = useProfile().userProfile;

  // get user profile details
  // useEffect(() => {
  //   dispatch(getProfileDetails());
  // }, [dispatch]);

  return (
    <div className="position-relative">
      {getProfileLoading && !isProfileFetched && <Loader />}
      <MyProfile user={user} />

      <AppSimpleBar className="p-4 profile-desc">
        <UserDescription user={user} location={"location"} />
        <hr className="my-4" />

        <Media media={profileDetails.media} limit={2} />

        <hr className="my-4" />

        <AttachedFiles attachedFiles={profileDetails.attachedFiles} />
      </AppSimpleBar>
    </div>
  );
};

export default Index;
