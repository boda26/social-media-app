import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import { fetchCategoriesAction } from '../../redux/slices/category/categorySlice';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

const CategoryDropDown = (props) => {
    //dispatch action
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategoriesAction())
    }, [dispatch])
    //select category
    const category = useSelector(state => state?.category)
    const {categoryList, loading, appErr, serverErr} = category;
    const allCategories = categoryList?.map(category => {
        return {
            label: category?.title,
            value: category?._id,
        }
    })

    //handle change
    const handleChange = (value) => {
        props.onChange('category', value);
    }
    //handleBlur
    const handleBlur =  () => {
        props.onBlur('category', true);
    }
    return (
        <div style={{margin:'1rem 0'}}>
            {loading ? (<h3 className='text-base text-green-600'>
                Categories list is loading...</h3>) : (
                <Select
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    id='category' 
                    options={allCategories} 
                    value={props?.value?.label}
                />
            )}
            {props?.error && (
            <div style={{color: 'red', marginTop: '.5rem'}}>{props?.error}
            </div>)}
        </div>
    )
}

export default CategoryDropDown