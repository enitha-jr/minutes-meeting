import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/NewMeeting.css';
import axios from 'axios';
import { UserContext } from '../UserContext'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom';
function NewMeeting() {

  const navigate = useNavigate()
  const location = useLocation();
  const { userData } = useContext(UserContext);

  const [followup, setFollowup] = useState('');
  const [title, setTitle] = useState('');
  const [mid, setMid] = useState('');
  const [dept, setDept] = useState('');
  const [host, setHost] = useState(userData?.username || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [desc, setDesc] = useState('');
  const [minutetaker, setMinutetaker] = useState('');
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);

  const handleAddMember = (e) => {
    if (e.key === 'Enter' && name.trim() !== '') {
      e.preventDefault();
      setMembers([...members, name]);
      setName('');
    }
  }

  useEffect(() => {
    const meetingdetails = location.state?.meetingdetails;
    if (meetingdetails) {
      setFollowup('yes');
      setTitle(meetingdetails.title || '');
      setMid(meetingdetails.mid || '');
      setDept(meetingdetails.dept || '');
      setHost(meetingdetails.host || '');
      setMinutetaker(meetingdetails.minutetaker || '');
      setDate(meetingdetails.date || '');
      setTime(meetingdetails.time || '');
      setVenue(meetingdetails.venue || '');
      setDesc(meetingdetails.description || '');
      setMembers(meetingdetails.members || []);
    }
  }, [location.state]);

  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get(`http://localhost:5000/users`)
      .then((response) => {
        setUsers(response.data);
      }).catch((error) => {
        console.log(error);
      });
    axios.get(`http://localhost:5000/groups`)
      .then((response) => {
        setUsers(response.data);
      }).catch((error) => {
        console.log(error);
      });
  }, [])

  const UsersOptions = () => {
    return users.map((user) => (
      <option key={user.userid}>{user.username}</option>
    ))
  }

  useEffect(() => {
    if (host && title) {
      axios
        .get(`http://localhost:5000/getmembers`, { params: { host, title } })
        .then((response) => {
          console.log(response.data);
          const fetchedMembers = Array.isArray(response.data) ? response.data : [];
          setMembers((prevMembers) => {
            return [...new Set([...prevMembers, ...fetchedMembers])];
          });
        })
        .catch((error) => {
          console.error("Error fetching members:", error);
        });
    }
  }, [host, title]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDate = new Date(date).toISOString().slice(0, 10);
    const newMeeting = { followup, title, mid, dept, host, date: newDate, time, venue, desc, members, minutetaker };
    console.log(newMeeting);
    try {
      axios.post("http://localhost:5000/newmeeting", newMeeting)
        .then((response) => {
          console.log(response.data);
          navigate("/meetings/upcoming")
        }).catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Error creating meeting');
    }
    setFollowup('');
    setTitle('');
    setMid('');
    setDept('');
    setHost('');
    setDate('');
    setTime('');
    setVenue('');
    setDesc('');
    setMinutetaker('');
    setName('');
    setMembers([]);
  }

  const handleRequest = async (e) => {
    e.preventDefault();
    const newDate = new Date(date).toISOString().slice(0, 10);
    const newMeeting = { followup, title, mid, dept, host, date: newDate, time, venue, desc, members, minutetaker };
    console.log(newMeeting);
    try {
      axios.post("http://localhost:5000/requestmeeting", newMeeting)
        .then((response) => {
          console.log(response.data);
          navigate("/meetings/upcoming")
        }).catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Error creating meeting');
    }
    setFollowup('');
    setTitle('');
    setMid('');
    setDept('');
    setHost('');
    setDate('');
    setTime('');
    setVenue('');
    setDesc('');
    setMinutetaker('');
    setName('');
    setMembers([]);
  }

  useEffect(() => {
    if (followup === 'no') {
      axios.get('http://localhost:5000/meetings/nextmid')
        .then(response => {
          setMid(response.data.nextmid);
        })
        .catch(error => {
          console.error('Error fetching next MID:', error);
        });
    } else if (followup === 'yes') {
      const meetingdetails = location.state?.meetingdetails;
      if (meetingdetails) {
        setMid(meetingdetails.mid || '');
      }
    } else {
      setMid('');
    }
  }, [followup, location.state]);

  return (
    <div className="newmeeting-content">
      <div className='newmeeting-container'>
        <div className="head3">
          <h3>NEW-MEETING</h3>
        </div>
        <form className="newmeeting-form">
          <div className="details">
            <div className="left">
              <div>
                <label htmlFor="follow-up">Follow-up:</label>
                <select name="followup" value={followup} onChange={e => setFollowup(e.target.value)} required>
                  <option value=''></option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="title">Title:</label>
                <input type="text" name="title" placeholder="Rewards meeting"
                  value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="mid">MID:</label>
                <input type="number" name="mid" placeholder={followup === 'no' ? mid : 'Enter MID'}
                  value={mid} onChange={e => setMid(e.target.value)}
                  disabled={followup === 'no'} required />
              </div>
              <div>
                <label htmlFor="dept">Dept/Team:</label>
                <input type="text" name="dept" placeholder="Reward Points Team"
                  value={dept} onChange={e => setDept(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="host">Host:</label>
                <input type="text" value={host} readOnly />
              </div>
              <div>
                <label htmlFor="desc">Description:</label>
                <textarea name="desc" value={desc}
                  onChange={e => setDesc(e.target.value)}> </textarea>
              </div>
            </div>
            <div className="right">

              <div>
                <label htmlFor="date">Date:</label>
                <input type="date" name="date"
                  value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="time">Time:</label>
                <input type="time" name="time"
                  value={time} onChange={e => setTime(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="venue">Venue:</label>
                <input type="text" name="venue" placeholder="WW101"
                  value={venue} onChange={e => setVenue(e.target.value)} required />
              </div>
              <div>
                <label>Minute Taker:</label>
                <select
                  value={minutetaker}
                  onChange={(e) => setMinutetaker(e.target.value)}>
                  <option value=''></option>
                  {UsersOptions()}
                </select>
              </div>
              <div>
                <label htmlFor="members">Members:</label>
                <select
                  value={name}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    if (selectedName.trim() !== '') {
                      setMembers((prevMembers) =>
                        prevMembers.includes(selectedName) ? prevMembers : [...prevMembers, selectedName]
                      );
                      setName('');
                    }
                  }}
                >
                  <option value=''>Select a member</option>
                  {UsersOptions()}
                </select>
                <div className="members-list">
                  {members.length > 0 ? (
                    members.map((member, index) => (
                      <div className="each-member" key={index}>
                        <div className="memb-name">{member}</div>
                        <div className="x" onClick={() => setMembers(members.filter((i) => i !== member))}>x</div>
                      </div>
                    ))
                  ) : (
                    <p>ADD MEMBERS</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="newmeeting-btn">
            {
              userData?.role === 'user' ? (
                <button type="submit" onClick={handleRequest}>REQUEST MEETING</button>
              ) : (
                <button type="submit" onClick={handleSubmit}>CREATE MEETING</button>
              )
            }
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewMeeting