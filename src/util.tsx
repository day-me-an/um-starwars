import * as React from 'react'

/**
 * Attempts to return a field that can act as a title.
 * Most SWAPI entities have a `name`, but one uses `title`. 
 */
export function getResourceTitle(record: any) {
  if (record) {
    if (record.name) {
      return record.name
    } else if (record.title) {
      return record.title
    }
  }
  return "Unknown"
}