export const deleteBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookingId = req.params.bookingId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!",
      });
    }

    // Find the booking
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found...!",
      });
    }

    // Mark the booking as deleted
    booking.isDeleted = true;
    await booking.save();

    return res.status(200).json({
      status: "success",
      message: "Booking hidden successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error...!",
    });
  }
};
