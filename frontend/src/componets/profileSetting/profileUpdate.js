import React, { useState } from 'react';

function ProfilePhotoUpdater() {
    const [profilePhoto, setProfilePhoto] = useState(null);

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handlePhotoChange} />
            {profilePhoto && (
                <img src={profilePhoto} alt="Profile" style={{ width: '100px', height: '100px' }} />
            )}
        </div>
    );
}

export default ProfilePhotoUpdater;