import React from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

function UserManagement(): React.ReactElement {
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'John.Doe@example.com',
      role: 'User',
      isActive: true,
    },
    {
      id: 2,
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'Admin',
      isActive: true,
    },
  ];

  return (
    <main>
      <header>
        <h1>User Management</h1>
        <p>View and manage registered HAAS users.</p>

        <button type="button">Add User</button>
      </header>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>

              <td>
                <button type="button">Edit</button>
                <button type="button">Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default UserManagement;