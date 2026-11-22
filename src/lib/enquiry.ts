import { scrollToHash } from './scroll'

export const PREFILL_EVENT = 'tca:prefill-enquiry'

/** Scroll to the enquiry form and preselect a project type. */
export function startEnquiry(projectType?: string) {
  if (projectType) window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { projectType } }))
  scrollToHash('#contact')
}
