import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useTranslation } from "react-i18next";
import bar from "../assets/images/bar.png"
import borehole from "../assets/images/borehole.png"
import dryerwasher from "../assets/images/dryer-and-washer.png"
import guestroom from "../assets/images/guest-room.png"
import layer from "../assets/images/layer.png"
import library from "../assets/images/library.png"
import parking from "../assets/images/parking-or-car-pack.png"
import petfriendly from "../assets/images/pet-friendly.png"
import playground from "../assets/images/playground.png"
import restaurant from "../assets/images/restaurant.png"
import restaurant1 from "../assets/images/restaurant-1.png"
import watertank from "../assets/images/water-tank.png"
import waterwell from "../assets/images/water-well.png"
import airconditioner from "../assets/images/air-conditioner.png"
import gym from "../assets/images/gym.png"
import security from "../assets/images/security.png"
import swimmer from "../assets/images/swimmer.png"
import wifi from "../assets/images/wifi.png"

const AmenitiesItem = (el) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ width: "100px", border: "1px solid #5b9c00", borderRadius: "15px", height: "95px", boxShadow: 0 }}>
      <CardContent sx={{ padding: "14px 0 !important" }}>
        <Box>
          {el?.el?.title === "bar" && <img src={bar} width={37} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "gym" && <img src={gym} width={28} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "wifi" && <img src={wifi} width={45} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "parking" && <img src={parking} width={47} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "car_park" && <img src={parking} width={44} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "play_ground" && <img src={playground} width={43} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "library" && <img src={library} width={32} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "restaurant" && <img src={restaurant} width={32} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "bath" && <img src={layer} width={34} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "guest_room" && <img src={guestroom} width={34} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "borehole" && <img src={borehole} width={33} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "water_well" && <img src={waterwell} width={30} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "water_tank" && <img src={watertank} width={24} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "pet_friendly" && <img src={petfriendly} width={36} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "washer_and_dryer" && <img src={dryerwasher} width={40} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "pool" && <img src={swimmer} width={45} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "security" && <img src={security} width={26} style={{ margin: "0 auto" }} alt="amenity" />}
          {el?.el?.title === "air_condition" && <img src={airconditioner} width={50} style={{ margin: "4px auto" }} alt="amenity" />}
          <Typography sx={{ textAlign: "center", textTransform: "capitalize", fontSize: "12px", fontWeight: "600", marginTop: ".5rem" }}>{t('amenities.' + el?.el?.title)}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AmenitiesItem