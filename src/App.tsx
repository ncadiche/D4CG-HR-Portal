import React, { useEffect, useState } from 'react';
import './App.css';
import { User } from './model';

function App() {
  // State variables
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);

  // Temporary Hardcoded Users
  const hardcodedUsers: User[] = [
    { id: 1, name: 'Alice', last_auth: '27 07 2024 10:15:30' },
    { id: 2, name: 'Bob', last_auth: '25 05 2024 08:45:10' },
    { id: 3, name: 'Charlie', last_auth: '15 06 2013 14:30:00' },
    { id: 4, name: 'David', last_auth: '15 06 2020 14:30:00' },
    { id: 5, name: 'Elaine', last_auth: '27 07 2024 10:15:30' },
    { id: 6, name: 'Frank', last_auth: '25 05 2024 08:45:10' },
    { id: 7, name: 'Grace', last_auth: '15 06 2019 14:30:00' },
    { id: 8, name: 'Hannah', last_auth: '15 06 2024 14:30:00' },
    // Add more users as needed below
  ];

  // Helper function to convert date string to epoch time
  const getEpochTimeFromString = (dateString: string) => {
    const [day, month, year, time] = dateString.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string format');
    }

    return date.getTime();
  };

  useEffect(() => {
    
      try {
        const userList: User[] = hardcodedUsers;

        const emailBlackList = [
          "ncadiche@uchicago.edu"
          // insert emails here
        ];

        const activeThreshold = '26 03 2023 0:0:0';
        const activeThresholdEpochInt = getEpochTimeFromString(activeThreshold);

        const newAllUsers: User[] = userList.filter((user) => !emailBlackList.includes(user.name));
        const newActiveUsers: User[] = newAllUsers.filter((user) => getEpochTimeFromString(user.last_auth) > activeThresholdEpochInt);
        const newInactiveUsers: User[] = newAllUsers.filter((user) => getEpochTimeFromString(user.last_auth) <= activeThresholdEpochInt);

        setAllUsers(newAllUsers);
        setActiveUsers(newActiveUsers);
        setInactiveUsers(newInactiveUsers);
        setDisplayUsers(newAllUsers);

      } catch (error) {
        console.error('Error:', error);
        setError((error as Error).message);
      }
  }, []);

  // Handler for searching users
  const handleSearch = () => {
    const searchResult = allUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setDisplayUsers(searchResult);
  };

  return (
    <div className="app-container">
      <header className="brand-bar">
        <div className="brand-title">Team Manager App</div>
        <button className="help-button" onClick={() => alert('In order to use the application you can scroll to view the users or use the left hand side bar to toggle between all users, active, and inactive users. You can also use the search bar to find a specific user.')}>
          ?
        </button>
      </header>

      <div className="content-wrapper">
        <nav className="side-nav">
          <div>All Users: {allUsers.length}</div>
          <div>Active Users: {activeUsers.length}</div>
          <div>Inactive Users: {inactiveUsers.length}</div>
          <button onClick={() => setDisplayUsers(allUsers)}>All Users</button>
          <button onClick={() => setDisplayUsers(activeUsers)}>Active Users</button>
          <button onClick={() => setDisplayUsers(inactiveUsers)}>Inactive Users</button>
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </nav>

        <main className="main-content">
          {displayUsers.length === 0 && (
            <div className="no-user-found">No user found</div>
          )}

          {displayUsers.map((user) => (
            <div key={user.id} className="user-panel">
              {user.name} 
              <span className={`status-dot ${activeUsers.includes(user) ? 'active' : 'inactive'}`}></span>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;