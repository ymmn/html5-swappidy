/**
 * Mutually exclusive states for a Block.
 * TODO Consider whether the two states, CREATE and GONE, should be present
 * for the BlockState enumeration (i.e. could they be considered implicit
 * states for a Block).
 */
window.BlockState = {
  CREATING: 0,
  PRE_FALLING: 0.5,
  FALLING: 1,
  SITTING: 2,
  INCUBATING: 3,
  SWAPPING_LEFT: 4,
  SWAPPING_RIGHT: 7,
  DYING: 5,
  GONE: 6
};
