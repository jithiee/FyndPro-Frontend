
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// -------- Fetch Employee Nearby List View  --------
export const fetchEmployeeNearbyLists = createAsyncThunk(
    "employeeNearby/fetchEmployeeNearbyLists",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/book/nearby/");
            return response.data; 
        } catch (error) {
            console.log('eerorr');
            
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch employee nearby list"
            );
        }
    }
);

// ---------- Create Booking -----------
export const bookingCreatetionByUser = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/book/create/", bookingData);      
      return response.data; 
    } catch (error) {
      const backendError =
        error.response?.data?.booking_date?.[0] ||
        error.response?.data?.error ||
        "Failed to create booking";

      return rejectWithValue({ error: backendError }); 
    }
  }
);


//------Fetch  Bookings in User Dashboard  ---------------
export const fetchUserBookings = createAsyncThunk(
  "booking/fetchEmployeeBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/book/client/");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch bookings"
      );
    }
  }
);


//------Fetch  Bookings in Employee Dashboard  ---------------
export const fetchEmployeeBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/book/employee/");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch bookings"
      );
    }
  }
);


//------ Update Booking Status -----------------
export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ book_id, status, working_hours }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/book/update/${book_id}/`, {
        status,
        working_hours,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Something went wrong" }
      );
    }
  }
);



const employeeNearbySlice = createSlice({
    name: "employeeNearby",
    initialState: {
        employeeList: null,
        booking: null, 
        userBookings: [],     
        loading: false,
        error: null,
        success: false,
    },

    reducers: {
        resetBookingState: (state) => {
            state.booking = null;
            state.error = null;
            state.success = false;
            state.loading = false;
        },

            // Optional: optimistic local update from UI (not required but convenient)
    optimisticUpdateBookingStatus: (state, action) => {
      const { book_id, status } = action.payload;
      state.userBookings = state.userBookings.map((b) =>
        b.book_id === book_id ? { ...b, status } : b
      );
    },

    },

      

    extraReducers: (builder) => {
        builder

            //----- Fetch Employee Nearby-------  
            .addCase(fetchEmployeeNearbyLists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeNearbyLists.fulfilled, (state, action) => {
                state.loading = false;
                state.employeeList = action.payload;
                state.success = true;
            })
            .addCase(fetchEmployeeNearbyLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // ----- Create Booking ------
            .addCase(bookingCreatetionByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.booking = null;
            })
            .addCase(bookingCreatetionByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;  
                state.success = true;
            })
            .addCase(bookingCreatetionByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;  
                state.success = false;
            })

            //------- Fetch User Bookings in Dashboard  -------------
            .addCase(fetchUserBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
            state.loading = false;
            state.userBookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })

            //------- Fetch Employee Bookings in Dashboard-------------
            .addCase(fetchEmployeeBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchEmployeeBookings.fulfilled, (state, action) => {
            state.loading = false;
            state.userBookings = action.payload;
            })
            .addCase(fetchEmployeeBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })

            //------- Update Booking Status -------------
             .addCase(updateBookingStatus.pending, (state) => {
              state.loading = true;
                  })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
              state.loading = false;
              state.success = true;

              const updated = action.payload;
                 state.userBookings = state.userBookings.map((b) =>
                        b.book_id === updated.book_id ? { ...b, ...updated } : b
                      );
                    })
                
                            // Update booking inside list instantly
              // state.userBookings = state.userBookings.map((b) =>
              //   b.book_id === updated.book_id
              //     ? { ...b, status: updated.status, working_hours: updated.working_hours }
              //     : b
              //   );
              // })
              
   
         
            .addCase(updateBookingStatus.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
              state.success = false;
            });

    },
});

export const { resetBookingState, optimisticUpdateBookingStatus } = employeeNearbySlice.actions;
export default employeeNearbySlice.reducer;
