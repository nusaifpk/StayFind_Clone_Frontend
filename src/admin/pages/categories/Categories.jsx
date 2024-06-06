import React, { useEffect, useState } from 'react';
import './Categories.css';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/esm/Button.js';
import adminInstance from '../../../aaxios_instance/AdminAxios.jsx';
import toast from 'react-hot-toast';
import Sidebar from '../../components/sidebar/Sidebar.jsx'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (e) => {
    setNewCategory(e.target.value);
  };

  const Lowercase = (string) => {
    return string.toLowerCase();
  };

  const handleSubmit = async () => {
    const smallerCategory = Lowercase(newCategory);
    try {
      const response = await adminInstance.post(`/api/admin/categories`, {
        name: smallerCategory,
      });
      toast.success(response.data.message);
      setNewCategory('');
      fetchCategories(); 
    } catch (error) {
      console.log('Error adding category: ', error);
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = async (categoryId, newName) => {
    const smallerCategory = Lowercase(newName);
    try {
      const response = await adminInstance.put(
        `/api/admin/categories/${categoryId}`,
        { name: smallerCategory }
      );
      toast.success(response.data.data.message || 'Category updated successfully');
      fetchCategories();
    } catch (error) {
      console.log('Error editing category: ', error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await adminInstance.delete(`/api/admin/categories/${categoryId}`);
        toast.success(response.data.data.message || 'Category deleted successfully');
        fetchCategories(); 
      } catch (error) {
        console.log('Error deleting category: ', error);
        toast.error(error.response.data.message);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminInstance.get(`/api/admin/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category_container">
      <Sidebar />
      <div className="main_content">
        <h1 className="category_header">Category List</h1>
        <table className="category_table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Category Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id} className="category_row">
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>
                  <i
                    className="fas fa-edit"
                    onClick={() => {
                      const newName = prompt('Enter the new name for the category');
                      if (newName !== null) {
                        handleEdit(category._id, newName);
                      }
                    }}
                  />
                </td>
                <td>
                  <i className="fas fa-trash" onClick={() => handleDelete(category._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="categories_section">
          <h1>Add Categories</h1>
          <div className="add_section">
            <TextField
              id=""
              label="Add Categories"
              variant="outlined"
              className="add_input"
              value={newCategory}
              onChange={handleChange}
            />
            <Button className="add_btn" onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
