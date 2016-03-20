
import _ from 'lodash';

const isDead = (target) => target.stats.hp.atMin();
const isFled = (target) => target.isFled;
const isStealth = (target) => target.findStatus('Stealth');

export const support = (targets) => {
    return _(targets).reject(isDead).reject(isFled).sample();
};

export const revival = (targets) => {
    return _(targets).filter(isDead).reject(isFled).sample();
};

export const damage  = (targets) => {
    return _(targets).reject(isDead).reject(isFled).reject(isStealth).sample();
};