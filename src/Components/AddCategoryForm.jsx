import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setCategories, addCategory, updateCategory } from '../redux/CreateSlice';

const AddCategoryForm = () => {
    const [formData, setFormData] = useState({ cat_name: '' });
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
  
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=get_categories');
          if (response.data && Array.isArray(response.data.categories)) {
            dispatch(setCategories(response.data.categories));
          } else {
            setSubmissionStatus('Error: Unexpected API response structure.');
          }
        } catch (error) {
          setSubmissionStatus(`Error fetching categories: ${error.message}`);
        }
      };
  
      fetchCategories();
    }, [dispatch]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('Form Data:', formData);
          console.log('Editing Category:', editingCategory);
      
          if (editingCategory) {
            console.log('Updating Category with ID:', editingCategory.main_cat_id);
            const response = await axios.post(
              'https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=update_main_catagory',
              {
                cat_name: formData.cat_name,
                main_cat_id: editingCategory.main_cat_id,
               
              }
            );
      
            dispatch(updateCategory({
              id: editingCategory.main_cat_id,
              newCatName: formData.cat_name
            }));
            setSubmissionStatus(`Success: ${response.data.message}`);
          } else {
            console.log('Adding new category with form data:', formData);
            const response = await axios.post(
              'https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=insert_main_catagory',
              formData
            );
      
            const newCategory = {
              ...formData,
              main_cat_id: response.data.main_cat_id // Ensure this ID is returned by your API
            };
            console.log('New Category:', newCategory);
            dispatch(addCategory(newCategory));
            setSubmissionStatus(`Success: ${response.data.message}`);
          }
          setFormData({ cat_name: '' });
          setEditingCategory(null);
        } catch (error) {
          setSubmissionStatus(`Error: ${error.response ? error.response.data.message : error.message}`);
        }
      };
  
    const handleEdit = (category) => {
      setFormData({ cat_name: category.cat_name });
      setEditingCategory(category);
    };
  
    console.log('Categories in render:', categories); // Log during render
  
    return (
      <div>
        <h1>{editingCategory ? 'Edit Category' : 'Add Category'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cat_name">Category Name:</label>
            <input
              type="text"
              id="cat_name"
              name="cat_name"
              value={formData.cat_name}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
        </form>
        {submissionStatus && <p>{submissionStatus}</p>}
  
        <h2>Category List</h2>
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.main_cat_id}>
                  <td>{category.cat_name}</td>
                  <td>
                    <button onClick={() => handleEdit(category)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No categories available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AddCategoryForm;