import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(response => setUser(response.data))
      .catch(error => console.error(error));
  }, [userId]);

  const handleConfirmGift = async (giftId) => {
    try {
      const response = await axios.post(`/api/users/${userId}/confirm-gift`, { giftId });
      setUser(response.data);
    } catch (error) {
      console.error('Error confirming gift:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h3>Welcome, {user.firstName} {user.lastName}</h3>
      <p>Level: {user.level}</p>
      <h4>Referrals:</h4>
      <ul>
        {user.referrals.map((referral) => (
          <li key={referral._id}>
            {referral.firstName} {referral.lastName} - {referral.phoneNumber}
          </li>
        ))}
      </ul>
      <h4>Gifted Users:</h4>
      <ul>
        {user.giftedUsers.map((giftedUser) => (
          <li key={giftedUser._id}>
            {giftedUser.firstName} {giftedUser.lastName} - {giftedUser.phoneNumber}
          </li>
        ))}
      </ul>
      <h4>Received Gifts:</h4>
      <ul>
        {user.gifts.map((gift) => (
          <li key={gift._id}>
            Amount: {gift.amount} - Date: {new Date(gift.date).toLocaleDateString()}
            {!gift.confirmed && <button onClick={() => handleConfirmGift(gift._id)}>Confirm Receipt</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
