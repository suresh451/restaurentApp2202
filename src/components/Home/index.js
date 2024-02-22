import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Home extends Component {
  state = {
    activeCategory: '',
    menuCategoryList: [],
    dishCounts: {},
    cartCount: 0,
  }

  componentDidMount() {
    this.getMenuCategories()
  }

  getMenuCategories = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      const fetchedData = data[0]
      const menuCategoryData = fetchedData.table_menu_list
      this.setState({menuCategoryList: menuCategoryData})

      // Initialize dish counts to 0 for each dish
      const dishCounts = {}
      menuCategoryData.forEach(category => {
        category.category_dishes.forEach(dish => {
          dishCounts[dish.dish_id] = 0
        })
      })
      this.setState({dishCounts})

      // Set active category to the first one
      if (menuCategoryData.length > 0) {
        this.setState({activeCategory: menuCategoryData[0].menu_category})
      }
    } catch (error) {
      console.error('Error fetching menu categories:', error)
    }
  }

  handleCategoryChange = category => {
    this.setState({activeCategory: category})
  }

  handleAddToCart = dishId => {
    const {dishCounts, cartCount} = this.state
    const updatedCounts = {...dishCounts}
    updatedCounts[dishId] += 1
    this.setState({
      dishCounts: updatedCounts,
      cartCount: cartCount + 1,
    })
  }

  handleRemoveFromCart = dishId => {
    const {dishCounts, cartCount} = this.state
    if (dishCounts[dishId] > 0) {
      const updatedCounts = {...dishCounts}
      updatedCounts[dishId] -= 1
      this.setState({
        dishCounts: updatedCounts,
        cartCount: cartCount - 1,
      })
    }
  }

  render() {
    const {menuCategoryList, activeCategory, dishCounts, cartCount} = this.state

    return (
      <div>
        <Header />
        {menuCategoryList.map(category => (
          <button
            key={category.menu_category}
            type="button"
            onClick={() => this.handleCategoryChange(category.menu_category)}
          >
            {category.menu_category}
          </button>
        ))}

        <div>
          {menuCategoryList.map(category => (
            <div
              key={category.menu_category}
              className={
                activeCategory === category.menu_category ? 'active' : 'hidden'
              }
            >
              {category.category_dishes.map(dish => {
                if (activeCategory === category.menu_category) {
                  return (
                    <div key={dish.dish_id} className="main-view">
                      <div>
                        <h2>{dish.dish_name}</h2>
                        <p>
                          {dish.dish_currency} {dish.dish_price}
                        </p>
                        <p>{dish.dish_description}</p>
                        <p>{dish.dish_calories} calories</p>
                        {dish.dish_Availability && (
                          <div className="incre-decre">
                            <button
                              type="button"
                              className="incre-btn"
                              onClick={() =>
                                this.handleRemoveFromCart(dish.dish_id)
                              }
                            >
                              -
                            </button>
                            <p>{dishCounts[dish.dish_id]}</p>
                            <button
                              type="button"
                              className="incre-btn"
                              onClick={() => this.handleAddToCart(dish.dish_id)}
                            >
                              +
                            </button>
                          </div>
                        )}
                        {dish.dish_Availability && (
                          <button
                            type="button"
                            className="button add-to-cart-btn"
                            onClick={() => this.handleAddToCart(dish.dish_id)}
                          >
                            ADD TO CART
                          </button>
                        )}
                      </div>
                      <div>
                        <img
                          src={dish.dish_image}
                          alt={dish.dish_name}
                          className="item-img"
                        />
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}
        </div>
        <p>Cart {cartCount}</p>
      </div>
    )
  }
}

export default Home
