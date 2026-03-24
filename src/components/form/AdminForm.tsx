
import { useState, useEffect} from 'react';
import {  FaTimes, FaEdit } from 'react-icons/fa';
import '../style/AdminForm.css';
import { AddUser } from '../modalWindows/AddUser';
import { AddPosition } from '../modalWindows/AddPosition';
import Swal from 'sweetalert2';
import type { AdminProfileResponse, AdminUpdateProfileRequest, AdminCreateProfileRequest} from '../types/Admin.ts';
import type { CreatePositionRequest, UpdatePositionRequest} from '../types/Position.ts';
import { EditUser } from '../modalWindows/EditUser';
import { EditPosition } from '../modalWindows/EditPosition';
import { type ProfileResponse } from '../types/Profile.ts';
import { getAllProfiles, adminCreateProfile, type UsersQuery, getAllFilteredProfiles, adminUpdateProfile, adminDeleteProfile} from '../../service/apiService/adminService.ts';
import { getAllDepartments} from '../../service/apiService/departamentsService.ts';
import { Select, Button, Flex} from 'antd';
import 'antd/dist/reset.css';
import { CloseCircleOutlined} from '@ant-design/icons';
import { createPosition, deletePosition, getAllPositionsByDepartamnetId, updatePosition } from '../../service/apiService/positionService.ts';
import { getAllDepartmentPositions, type PositionsQuery } from '../../service/apiService/departamentPositionService.ts';
import type { DepartmentPositionResponse } from '../types/DepartmentPosition.ts';

interface AdminFormProps {
  onAdminClick: () => void;  
}

export const AdminForm = ({onAdminClick}: AdminFormProps)  => {
  const [users, setUsers ]= useState<AdminProfileResponse[]>([]);
  const [positions, setPosition ]= useState<DepartmentPositionResponse[]>([]);

  const [optionsDepart, setOptionsDepart] = useState<
    { label: string; value: number }[]
  >([])

  const [optionsPosition, setOptionsPosition] = useState<
      { label: string; value: number }[]
    >([])

  const [activeButton, setActiveButton] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminProfileResponse | null>(null);
  const [editingPosition, setEditingPosition] = useState<DepartmentPositionResponse | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddPositionModal, setShowAddPositionModal] = useState(false);
  const [showEditUserModel, setShowEditUserModal] = useState(false);
  const [showEditPositionModal, setShowEditPositionModal] = useState(false);


   const [queryUser, setQueryUser] = useState<UsersQuery>({
        pageNumber: 1,
        pageSize: 10,
    })
 
    const [queryPosition, setQueryPosition] = useState<PositionsQuery>({
        departmentName: undefined,
        positionName:undefined,
        pageNumber: 1,
        pageSize: 10,
    })

    const selectDepart = optionsDepart.find(opt => opt.label === queryPosition.departmentName);
    

  const fetchProfile = () => {
       getAllProfiles(queryUser.pageNumber, queryUser.pageSize).then(res => {
          setUsers(res)
        })
    }

    const fetchPositions = () => {
        getAllDepartmentPositions(queryPosition).then(res => { 
          setPosition(res)
        })
    }

     useEffect(() => {
        if (!selectDepart?.value) return;
        getAllPositionsByDepartamnetId(selectDepart?.value).then(res => {
            const formatted = res.map((item) => ({
                label: item.name,
                value: item.id,
            }))

      setOptionsPosition(formatted);
    })
    }, [selectDepart?.value])

   useEffect(() => {
        getAllDepartments().then(res => {
            const formatted = res.map((item) => ({
                label: item.name,
                value: item.id,
            }))

      setOptionsDepart(formatted)
    })
    }, [])

   useEffect(() => {
        getAllProfiles(queryUser.pageNumber, queryUser.pageSize).then(res => {
          setUsers(res)
        })
    }, [queryUser.pageNumber, queryUser.pageSize])

    useEffect(() => {
        const loadPosition = async () => {
            getAllDepartmentPositions(queryPosition).then(res => {
            setPosition(res)
            })
        }
         loadPosition()
    }, [queryPosition])

    useEffect(() => {
        const loadUsers = async () => {
           const res = await getAllFilteredProfiles(queryUser)
           setUsers(res)
        }

        loadUsers()
    }, [queryUser])

  const toggleAddUserModal = () => {
    setShowAddUserModal(!showAddUserModal);
  };

  const toggleAddPositionModal = () => {
    setShowAddPositionModal(!showAddPositionModal);
  };

  const toggleEditUserModal = (user?: AdminProfileResponse) => {
    if (user) {
        setEditingUser(user);
    }
    setShowEditUserModal(!showEditUserModel);
    };

  const toggleEditPositionModal = (position?: DepartmentPositionResponse) => {
    if (position) {
        setEditingPosition(position);
    }
       setShowEditPositionModal(!showEditPositionModal);
    };

  const addToUser = async  (userData: AdminCreateProfileRequest) => {
      await adminCreateProfile(userData);
      await fetchProfile();
      setShowAddUserModal(false);
  };

  const editToUser = async (newData: ProfileResponse | null) => {
    if (!newData) return;
    const updateData: AdminUpdateProfileRequest = {
      id: newData.id,
      firstName: newData.firstName,
      lastName: newData.lastName,
      patronymic: newData.patronymic,
      phoneNumber: newData.phoneNumber,
      birthDate: newData.birthDate,
      email: newData.email,
      departmentId: newData.departmentId,
      positionId: newData.positionId,
      isActive: newData.isActive
    }
   await adminUpdateProfile(updateData);
   await fetchProfile();
   setShowEditUserModal(false);
  };

  const addToPosition = async (positionData: CreatePositionRequest) => {
    await createPosition(positionData);
    await fetchPositions();
    setShowAddPositionModal(false);
  };

  const editToPosition = async(newData: DepartmentPositionResponse | null) => {
    if (!newData) return;
    const updatedPosition: UpdatePositionRequest = {
        id: newData.position.id,
        name: newData.position.name,
    };
    await updatePosition(updatedPosition);
    await fetchPositions();
    setShowEditPositionModal(false);
  };

    const removePositionByIndex = async(id:number) => {
        const result = await Swal.fire({
        title: 'Вы уверены?',
        text: "Это действие нельзя отменить!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена'
        })

        if (result.isConfirmed) {
           await deletePosition(id);
           await fetchPositions();
        }
    };

    const removeUserByIndex = async (userId:number) => {
        const result = await Swal.fire({
        title: 'Вы уверены?',
        text: "Это действие нельзя отменить!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена'
        })
        
        if (result.isConfirmed) {
           await adminDeleteProfile(userId);
           await fetchProfile();
        }
    }

  return (
    <>
    <div className='admin-container'>
        <div className='admin-header-container'>
            <h1>Пользователи</h1>
            <button className='admin-form-button' onClick={onAdminClick}>Вернуться к профилю</button>
        </div>
        {activeButton === false ? (
        <div className='admin-info'>
            <div className = 'info-box-admin'>
                <span onClick={() => setActiveButton(false)}>Список</span>
                <span onClick={() => setActiveButton(true)}>Должности</span>
            </div>

             <hr/>
                <input className='search-admin' 
                type='search'
                placeholder="Поиск"
                onChange={(e) => {
                    const value = e.target.value
                    setQueryUser(prev => ({
                    ...prev,
                    fullName: value || undefined,
                    }))
                }}/> 
                
                <Button className='add-user-button'  onClick={toggleAddUserModal}>Добавить пользователя</Button>
                <Button className='add-user-button' onClick={() =>
                        setQueryUser(prev => ({
                        ...prev,
                        isActive: undefined,
                        departmentId: undefined,
                        fullName: undefined,
                        }))
                    }>Сбросить фильтры</Button>

            {showAddUserModal && (
                <AddUser 
                onCancelWindow={toggleAddUserModal}
                onAddUser={addToUser}/>

            )};

            <div className ='list-users'>
                <div className = 'header-list'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>
                            ФИО
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Отделение</span>
                        <Select
                            size="small"
                            style={{ width: 32, height: 32 }}
                            suffixIcon={<span style={{ fontSize: '12px'}}>▼</span>}
                            options={optionsDepart}
                            onChange={(value) => {
                                setQueryUser(prev => ({
                                ...prev,
                                departmentId: value,
                                }))
                            }}
                            dropdownStyle={{
                                minWidth: '200px', 
                                fontSize: '14px',  
                            }}
                        />
                        {queryUser.departmentId !== undefined && (
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() =>
                                    setQueryUser(prev => ({
                                        ...prev,
                                        departmentId: undefined,
                                    }))
                                }
                                type="text"
                                danger
                            />
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Статус</span>
                        <Select
                            size="small"
                            style={{ width: 32, height: 32 }}
                            suffixIcon={<span style={{ fontSize: '12px'}}>▼</span>}
                            popupMatchSelectWidth={false}
                            options={[
                                { value: true, label: 'Активен' },
                                { value: false, label: 'Не активен' },
                            ]}
                            onChange={(value) =>
                                setQueryUser(prev => ({
                                ...prev,
                                isActive: value,
                                }))
                            }
                            dropdownStyle={{
                                minWidth: '120px', 
                                fontSize: '14px',  
                            }}
                        />
                        {queryUser.isActive !== undefined && (
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() =>
                                    setQueryUser(prev => ({
                                        ...prev,
                                        isActive: undefined,
                                    }))
                                    }
                                type="text"
                                danger
                            />
                            )}
                    </div>
                </div>
                
                {users.map((user) => (
                    <div className='list-items' key={user.id}>
                        <text>{user.fullName}</text>
                        <text>{user.departmentName}</text>
                        <text>{user.isActive ? "Активен" : "Не активен"}</text>
                        <FaEdit
                            onClick={()=> toggleEditUserModal(user)}
                        />
                        <button className='cross' onClick={() => removeUserByIndex(user.id)}>
                          <FaTimes size={24} color="grey" />
                        </button>          
                    </div>
                ))}
     
            </div>
            <Flex style={{ marginLeft: 50 }}>
                <Select
                    value={queryUser.pageSize}
                    style={{ width: 120 }}
                    options={[
                    { value: 10, label: "10 / page" },
                    { value: 25, label: "25 / page" },
                    { value: 50, label: "50 / page" },
                    ]}
                    onChange={(value) => {
                    setQueryUser((prev) => ({
                        ...prev,
                        pageSize: value,
                        pageNumber: 1,
                    }));
                    }}
                />

                <div className='page-button'>
                    <Button onClick={() => setQueryUser(prev => ({...prev, pageNumber: prev.pageNumber - 1}))} disabled={queryUser.pageNumber === 1}>
                    Назад
                    </Button>
                    <span>
                      {queryUser.pageNumber}
                    </span>
                    <Button onClick={() => setQueryUser(prev => ({...prev, pageNumber: prev.pageNumber + 1}))}>
                    Вперёд
                    </Button>
                </div>  

            </Flex>
            
            {showEditUserModel && editingUser && (
                <EditUser 
                    onCancelWindow={() => toggleEditUserModal()}
                    userData={editingUser}
                    onSave={(newData) => {
                    editToUser(newData);
                    toggleEditUserModal(); 
                    }}
                />
            )}
        </div>
        ) : (
        <div className='admin-info'>
            <div className = 'info-box-admin'>
                <span onClick={() => setActiveButton(false)}>Список</span>
                <span onClick={() => setActiveButton(true)}>Должности</span>
            </div>

             <hr/>

            <input className='search-admin' 
             type='search'
             placeholder="Поиск"
             onChange={(e) => {
                    const value = e.target.value
                    setQueryPosition(prev => ({
                    ...prev,
                    departmentName: value || undefined,
                    }))
            }}/> 
                
            <Button className='add-user-button' onClick={toggleAddPositionModal}>Добавить должность</Button>
            <Button className='add-user-button' onClick={() =>
                        setQueryPosition(prev => ({
                        ...prev,
                        departmentName: undefined,
                        positionName: undefined,
                        }))
                    }>Сбросить фильтры</Button>

            {showAddPositionModal && (
                <AddPosition 
                onCancelWindow={toggleAddPositionModal}
                onAddPosition={addToPosition}/>
            )};

            <div className ='list-position'>
                <div className = 'header-position-list'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Отделение</span>
                        <Select
                            options={optionsDepart}
                            onChange={(value) => {
                                const option = optionsDepart.find(opt => opt.value === value);
                                setQueryPosition(prev => ({
                                ...prev,
                                departmentName: option?.label,
                                }))
                            }}
                            size="small"
                            style={{ width: 32, height: 32 }}
                            suffixIcon={<span style={{ fontSize: '12px'}}>▼</span>}
                            dropdownStyle={{
                                minWidth: '200px', 
                                fontSize: '14px',  
                            }}
                        />
                        {queryPosition.departmentName !== undefined && (
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() =>
                                    setQueryPosition(prev => ({
                                        ...prev,
                                        departmentName: undefined,
                                    }))
                                }
                                type="text"
                                danger
                            />
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>Должность</span>
                        {selectDepart && (
                        <>
                        <Select
                            options={optionsPosition}
                            onChange={(value) => {
                                const option = optionsPosition.find(opt => opt.value === value);
                                setQueryPosition(prev => ({
                                ...prev,
                                positionName: option?.label,
                                }))
                            }}
                            size="small"
                            style={{ width: 32, height: 32 }}
                            suffixIcon={<span style={{ fontSize: '12px'}}>▼</span>}
                            dropdownStyle={{
                                minWidth: '200px', 
                                fontSize: '14px',  
                            }}
                        />
                        {queryPosition.positionName !== undefined && (
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={() =>
                                    setQueryPosition(prev => ({
                                        ...prev,
                                        positionName: undefined,
                                    }))
                                }
                                type="text"
                                danger
                            />
                        )}
                        </>
                        )} 
                    </div>   
                </div>
                
                {positions.map((position) => (
                    <div className='list-position-items' >
                        <text>{position.department.name}</text>
                        <text>{position.position.name}</text>
                        <FaEdit
                            onClick={()=> toggleEditPositionModal(position)}
                        />
                        <button className='cross' onClick={() => removePositionByIndex(position.position.id)}>
                          <FaTimes size={24} color="grey" />
                        </button>
                    </div>
                ))}
            </div>

             <Flex style={{ marginLeft: 50 }}>
                <Select
                    value={queryPosition.pageSize}
                    style={{ width: 120 }}
                    options={[
                    { value: 10, label: "10 / page" },
                    { value: 25, label: "25 / page" },
                    { value: 50, label: "50 / page" },
                    ]}
                    onChange={(value) => {
                    setQueryPosition((prev) => ({
                        ...prev,
                        pageSize: value,
                        pageNumber: 1,
                    }));
                    }}
                />

                <div className='page-button'>
                    <Button onClick={() => setQueryPosition(prev => ({...prev, pageNumber: prev.pageNumber - 1}))} disabled={queryPosition.pageNumber === 1}>
                    Назад
                    </Button>
                    <span>
                      {queryPosition.pageNumber}
                    </span>
                    <Button onClick={() => setQueryPosition(prev => ({...prev, pageNumber: prev.pageNumber + 1}))}>
                    Вперёд
                    </Button>
                </div>  

            </Flex>

            {showEditPositionModal && editingPosition && (
                <EditPosition 
                    onCancelWindow={() => toggleEditPositionModal()}
                    positionData={editingPosition}
                    onSave={(newData) => {
                    editToPosition(newData);
                    toggleEditPositionModal(); 
                }}
                />
            )}
        </div>
         )}
    </div>
    </>
  );
};