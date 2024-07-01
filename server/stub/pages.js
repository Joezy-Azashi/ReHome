const pages = {
    home: {
        title: "ReHome Africa",
        description: "ReHome is a real estate hub for individuals and families looking for the most suitable properties and locations in Ghana. Our goal is to simplify your house-hunting journey by equipping you with knowledge and connecting you with professional brokers and developers. Visit our blog to get more hacks about owning a home in Ghana.",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
    mortgage: {
        title : "Mortgage",
        description: "Your home is more than a place to live. It’s an investment in a better future. We’ll help you unlock a better home and keep it working for you",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
    sell: {
        title: "Sell Your Home",
        description: "Open your doors to new business possibilities and connect with house hunters in Ghana, USA, UK, France and Netherlands.",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
    "off-plan" : {
        title: "Off-Plan Properties",
        description: "Off-Plan Properties",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
    "find-a-broker": {
        title: "ReHome Brokers",
        description: "ReHome is your dependable platform if you're searching for a professional real estate agent with a wealth of industry experience. Browse our trusted brokers and find the ideal match for your needs today!",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
    about: {
        title: "About ReHome",
        description: "ReHome is your go-to platform for finding houses and apartments in Ghana. Whether you're searching for houses for sale and rent, we have a wide selection to meet your needs. Our platform features listings in popular areas like Accra and East Legon, ensuring you find the perfect home. Trust ReHome to help you find your dream property in Ghana.",
        thumbnail: "https://rehcontainer01.blob.core.windows.net/pictures/165mo44jlnw2djwh2l1o7yo4-1679416512710.jpeg"
    },
}
module.exports.getPageById = id => pages[id];