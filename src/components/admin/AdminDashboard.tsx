import { useState, useEffect } from 'react';
import userService from '../../services/UserService';
import { AviationUser } from '../../types/AviationUser';
import { ListGroup, Button, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch } from 'antd';
import { toast } from 'react-toastify';
import UserFlight from '../../types/UserFlight';
import { Collapse, Row, Col } from 'antd';
import '../../styles/AdminDashboard.css';
import AirlineUserChart from './AirlineUserChart';
import UserAirlineRatio from '../../types/stats/UserAirlineRatio';
import BlockedUsersChart from './BlockedUsersChart';
import CreatedAtUserChart from './CreatedAtUserChart';
import CreatedAtUser from '../../types/stats/CreatedAtUser';
import { Tab, Tabs, TabPanel, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const { Panel } = Collapse;

function AdminDashboard() {
    const [users, setUsers] = useState<AviationUser[]>([]);
    const [user, setUser] = useState<AviationUser>();
    const [filteredUsers, setFilteredUsers] = useState<AviationUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [userFlights, setUserFlights] = useState<UserFlight[]>([]);
    const [recentlySelected, setRecentlySelected] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [usersAirlineRatio, setUsersAirlineRatio] = useState<UserAirlineRatio[]>([]);
    const [createdUsers, setCreatedUsers] = useState<CreatedAtUser[]>([]);
    const [blockedUsersCount, setBlockedUsersCount] = useState<number[]>([]);
    const [key, setKey] = useState<string>('airline');

    useEffect(() => {
        fetchUsers();
        getUserAirlineRatio();
        getCreatedAtUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            getBlockedUsersCount();
        }
    }, [users]);

    const fetchUsers = () => {
        try {
            userService.getUsers().subscribe(
                (users) => {
                    setUsers(users);
                    setFilteredUsers(users);
                }
            );
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getUserAirlineRatio = () => {
        try {
            userService.getUserAirlineRatio().subscribe(
                (ratio) => {
                    setUsersAirlineRatio(ratio);
                }
            )
        } catch (error) {
            console.log('Error with fetching users airline ratio')
        }
    }

    const getBlockedUsersCount = () => {
        try {
            userService.getBlockedUsersCount().subscribe(
                (count) => {
                    setBlockedUsersCount([count, users.length]);
                }
            )
        } catch (error) {
            console.log('Error with fetching blocked users count')
        }
    }

    const getCreatedAtUsers = () => {
        try {
            userService.getCreatedAtUsers().subscribe(
                (count) => {
                    setCreatedUsers(count);
                }
            )
        } catch (error) {
            console.log('Error with fetching blocked users count')
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(query)));
    };

    const handleToggleBlock = (email: string, currentStatus: boolean | undefined) => {
        try {
            userService.setUserStatus(email, currentStatus).subscribe(
                () => fetchUsers()
            );
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status.');
        }
    };

    const handleDeleteUser = (email: string) => {
        try {
            userService.deleteUser(email).subscribe(
                () => fetchUsers()
            );

        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const fetchUserDetails = (email: string) => {
        try {
            userService.getOneByEmail(email).subscribe(
                (user) => {
                    setUser(user);
                }
            );
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to fetch user details.');
        }
    };

    const handleUnassign = (email: string, flightId: number) => {
        setSelectedUser(email);
        if (!recentlySelected) {
            userService.deleteFlight(email, flightId).subscribe(
                () => fetchUserDetails(email)
            );
        }
    };


    const handleUserClick = (email: string) => {
        setSelectedUser(email);
        if (!recentlySelected) {
            fetchUserDetails(email);
            userService.getFlightsForUser(email).subscribe(
                (flights) => setUserFlights(flights)
            );
        }
    };

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin dashboard</h1>
            <Tabs id="dashboards"
            >
                <TabList>
                    <Tab>Users-airlines count</Tab>
                    <Tab>Blocked-active users count</Tab>
                    <Tab>Users created count</Tab>
                </TabList>
                <TabPanel title="Users-airlines count">
                    <AirlineUserChart data={usersAirlineRatio} />
                </TabPanel>
                <TabPanel title="Blocked-active users count" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <BlockedUsersChart data={blockedUsersCount} />
                </TabPanel>
                <TabPanel title="Users created count">
                    <CreatedAtUserChart data={createdUsers} />
                </TabPanel>
            </Tabs>
            <FormControl
                type="text"
                placeholder="Search by email"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-3"
            />
            <ListGroup className="user-list">
                {filteredUsers.map(user => (
                    <ListGroup.Item key={user.email} onClick={() => handleUserClick(user.email)} action className={user.role === 'ADMIN' ? "admin-item" : "user-item"}>
                        <div className="user-header">
                            <strong>{user.name} {user.surname}</strong> ({user.email})
                        </div>
                        <div className="user-actions d-flex justify-content-between">
                            {user.role !== 'ADMIN' &&
                                <div>
                                    <Switch
                                        onChange={() => handleToggleBlock(user.email, !user.isBlocked)}
                                        checked={!user.isBlocked}
                                        style={{ backgroundColor: user.isBlocked ? 'red' : 'green' }}
                                    />
                                    <p>Blocked: {user.isBlocked ? 'true' : 'false'}</p>
                                </div>
                            }
                            {user.role !== 'ADMIN' &&
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteUser(user.email)}
                                    className="delete-button"
                                >
                                    Delete permanently
                                </Button>

                            }
                        </div>
                        {selectedUser === user.email && (
                            <Collapse defaultActiveKey={['1']}>
                                <Panel header="User details" key="1" className="user-details">
                                    <div>
                                        <Row className="flight-header" gutter={[16, 16]}>
                                            <Col span={6}><strong>Name</strong></Col>
                                            <Col span={6}><strong>Surname</strong></Col>
                                            <Col span={6}><strong>Email</strong></Col>
                                            <Col span={6}><strong>Phone number</strong></Col>
                                        </Row>

                                        <Row gutter={[16, 16]}>
                                            <Col span={6}>{user.name}</Col>
                                            <Col span={6}>{user.surname}</Col>
                                            <Col span={6}>{user.email}</Col>
                                            <Col span={6}>{user?.phoneNumber || "Not given"}</Col>

                                        </Row>

                                    </div>
                                </Panel>
                                {
                                    user.role !== 'ADMIN' &&
                                    <Panel header="User Flights" key="2" className="user-flights">

                                        {userFlights.length > 0 ? (
                                            <div>
                                                <Row className="flight-header" gutter={[16, 16]}>
                                                    <Col span={4}><strong>Flight ID</strong></Col>
                                                    <Col span={4}><strong>Departure gate/terminal</strong></Col>
                                                    <Col span={4}><strong>Airline</strong></Col>
                                                    <Col span={4}><strong>Arrival gate/terminal</strong></Col>
                                                    <Col span={4}><strong>Unassign from flight</strong></Col>
                                                </Row>
                                                {userFlights.map((flight, index) => (
                                                    <Row className={index % 2 === 0 ? "even-row" : "odd-row"} key={index} gutter={[16, 16]}>
                                                        <Col span={4}>{flight.id || "-"}</Col>
                                                        <Col span={4}>{flight.departureGate || "-"}/{flight.departureTerminal || "-"}</Col>
                                                        <Col span={4}>{flight.airline || "-"}</Col>
                                                        <Col span={4}>{flight.arrivalGate || "-"}/{flight.arrivalTerminal || "-"}</Col>
                                                        <Col span={4}>

                                                            <Button
                                                                variant='warning'
                                                                style={{
                                                                    width: 100, height: 20, fontSize: 12, textAlign: 'center',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                                onClick={() => handleUnassign(user.email, flight.id)}>
                                                                Unassign
                                                            </Button>

                                                        </Col>

                                                    </Row>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No flights found for this user.</p>
                                        )}
                                    </Panel>
                                }
                            </Collapse>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default AdminDashboard;
