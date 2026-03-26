import { useState, useRef } from "react";
import "./TouristModePredictor.css";

const LOOKUP = {"exact":{"Female|18-25|25k-50k":{"count":1,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Travel Time","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":1.0,"sat_affordability":1.0,"sat_comfort":1.0,"sat_safety":1.0,"sat_accessibility":1.0,"sat_cleanliness":1.0,"sat_staff":1.0,"sat_language":1.0,"sat_overall":1.0,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"No","sc_daily_pass":"yes","sc_freq_increase":"No","sc_fare_comfort":"Not Sure","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"Not Sure","sc_env_friendly":"yes"},"Female|18-25|<25k":{"count":9,"primary_mode":"Two-Wheeler","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Travel Time, Comfort, Safety, Availability","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.1,"sat_affordability":3.2,"sat_comfort":3.1,"sat_safety":3.2,"sat_accessibility":2.9,"sat_cleanliness":3.1,"sat_staff":3.1,"sat_language":3.3,"sat_overall":3.2,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|26-35|25k-50k":{"count":1,"primary_mode":"Rental Cab, Auto-Rikshaw, Two-Wheeler, Walk/Cycle","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Cost, Availability, Gender Related Safety","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":2.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":3.0,"sat_language":2.0,"sat_overall":3.0,"gender_influence":"yes","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"Not Sure","sc_clear_info":"yes","sc_env_friendly":"Not Sure"},"Female|26-35|50k-1L":{"count":1,"primary_mode":"Rental Cab, Private Car","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Comfort, Safety, Gender Related Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Not Prefers","sat_availability":3.0,"sat_affordability":3.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":3.0,"sat_cleanliness":3.0,"sat_staff":2.0,"sat_language":3.0,"sat_overall":3.0,"gender_influence":"May be","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|26-35|<25k":{"count":3,"primary_mode":"Private Car","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Private /Rented Vehicle","reason":"Cost, Travel Time, Comfort, Safety, Availability","travel_time":"30-45 min","travel_cost":"50-100","use_pt":"Occasionaly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":4.0,"sat_safety":4.3,"sat_accessibility":4.0,"sat_cleanliness":4.0,"sat_staff":4.3,"sat_language":4.0,"sat_overall":4.3,"gender_influence":"no","pt_safe_gender":"Very Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"No","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|26-35|>1L":{"count":3,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Travel Time","travel_time":">45min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":1.0,"sat_affordability":2.0,"sat_comfort":1.0,"sat_safety":2.0,"sat_accessibility":2.0,"sat_cleanliness":2.0,"sat_staff":1.0,"sat_language":2.0,"sat_overall":2.0,"gender_influence":"May be","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|36-45|25k-50k":{"count":1,"primary_mode":"Auto-Rikshaw","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost","travel_time":"15-30 min","travel_cost":"100-150","use_pt":"Regularly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":4.0,"sat_accessibility":3.0,"sat_cleanliness":2.0,"sat_staff":1.0,"sat_language":4.0,"sat_overall":3.0,"gender_influence":"May be","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|36-45|50k-1L":{"count":2,"primary_mode":"Rental Cab, Two-Wheeler, Private Car","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Train","reason":"Cost, Comfort","travel_time":">45min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":4.0,"sat_safety":4.0,"sat_accessibility":4.0,"sat_cleanliness":4.0,"sat_staff":4.0,"sat_language":3.5,"sat_overall":4.0,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|36-45|>1L":{"count":2,"primary_mode":"Auto-Rikshaw","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":1.0,"sat_affordability":1.0,"sat_comfort":1.0,"sat_safety":1.0,"sat_accessibility":1.0,"sat_cleanliness":1.0,"sat_staff":1.0,"sat_language":1.0,"sat_overall":1.0,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"No","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|46-60|>1L":{"count":1,"primary_mode":"Rental Cab","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Flight","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Not Prefers","sat_availability":3.0,"sat_affordability":3.0,"sat_comfort":2.0,"sat_safety":2.0,"sat_accessibility":3.0,"sat_cleanliness":1.0,"sat_staff":1.0,"sat_language":3.0,"sat_overall":2.0,"gender_influence":"yes","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|18-25|25k-50k":{"count":2,"primary_mode":"Rental Cab, Auto-Rikshaw, Shared Taxi","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Comfort, Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Regularly","sat_availability":3.5,"sat_affordability":3.5,"sat_comfort":3.5,"sat_safety":3.5,"sat_accessibility":3.5,"sat_cleanliness":2.0,"sat_staff":3.5,"sat_language":3.5,"sat_overall":3.0,"gender_influence":"no","pt_safe_gender":"Very Safe","sc_single_route":"Not Sure","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"No","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|18-25|<25k":{"count":9,"primary_mode":"City Bus","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Travel Time","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Occasionaly","sat_availability":1.7,"sat_affordability":2.1,"sat_comfort":1.9,"sat_safety":2.1,"sat_accessibility":2.1,"sat_cleanliness":1.6,"sat_staff":2.1,"sat_language":2.1,"sat_overall":1.7,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|26-35|25k-50k":{"count":17,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Availability","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.2,"sat_affordability":3.7,"sat_comfort":2.8,"sat_safety":2.9,"sat_accessibility":3.2,"sat_cleanliness":2.9,"sat_staff":3.0,"sat_language":3.2,"sat_overall":3.1,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|26-35|50k-1L":{"count":11,"primary_mode":"City Bus, Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"15-30 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":1.7,"sat_affordability":2.3,"sat_comfort":1.7,"sat_safety":2.0,"sat_accessibility":2.0,"sat_cleanliness":1.9,"sat_staff":2.2,"sat_language":1.9,"sat_overall":2.0,"gender_influence":"yes","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"No","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|26-35|<25k":{"count":13,"primary_mode":"City Bus, Auto-Rikshaw","freq_mode":"Mixed Transport","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Regularly","sat_availability":3.7,"sat_affordability":3.8,"sat_comfort":2.9,"sat_safety":3.4,"sat_accessibility":3.2,"sat_cleanliness":2.6,"sat_staff":3.5,"sat_language":3.8,"sat_overall":2.9,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|26-35|>1L":{"count":5,"primary_mode":"City Bus, Auto-Rikshaw, Private Car","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Cost, Comfort, Safety, Availability","travel_time":"30-45 min","travel_cost":">150","use_pt":"Not Prefers","sat_availability":2.8,"sat_affordability":2.4,"sat_comfort":2.4,"sat_safety":2.4,"sat_accessibility":2.8,"sat_cleanliness":1.6,"sat_staff":2.8,"sat_language":2.4,"sat_overall":2.4,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|36-45|25k-50k":{"count":2,"primary_mode":"Auto-Rikshaw","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Train","reason":"Comfort","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Occasionaly","sat_availability":1.0,"sat_affordability":1.0,"sat_comfort":1.0,"sat_safety":1.0,"sat_accessibility":1.0,"sat_cleanliness":2.0,"sat_staff":1.0,"sat_language":1.0,"sat_overall":1.0,"gender_influence":"yes","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|36-45|>1L":{"count":5,"primary_mode":"Shared Taxi","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":2.0,"sat_affordability":2.0,"sat_comfort":2.4,"sat_safety":2.4,"sat_accessibility":2.8,"sat_cleanliness":2.8,"sat_staff":2.8,"sat_language":2.0,"sat_overall":2.4,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"Not Sure","sc_daily_pass":"No","sc_freq_increase":"No","sc_fare_comfort":"No","sc_mobile_app":"Not Sure","sc_5min_stops":"Not Sure","sc_clear_info":"No","sc_env_friendly":"No"},"Male|46-60|50k-1L":{"count":3,"primary_mode":"Auto-Rikshaw, Shared Taxi, Two-Wheeler, Walk/Cycle","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Cost, Availability","travel_time":"30-45 min","travel_cost":"50-100","use_pt":"Regularly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":4.0,"sat_language":3.0,"sat_overall":3.0,"gender_influence":"May be","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Others|26-35|50k-1L":{"count":3,"primary_mode":"Rental Cab","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":5.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":3.0,"sat_language":4.0,"sat_overall":4.0,"gender_influence":"May be","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}},"gender_age":{"Female|18-25":{"count":12,"primary_mode":"Two-Wheeler","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Travel Time, Comfort, Safety, Availability","travel_time":">45min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":2.8,"sat_affordability":3.0,"sat_comfort":2.9,"sat_safety":3.0,"sat_accessibility":2.4,"sat_cleanliness":2.8,"sat_staff":2.8,"sat_language":2.8,"sat_overall":2.8,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|26-35":{"count":8,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Travel Time","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":2.8,"sat_affordability":3.1,"sat_comfort":2.5,"sat_safety":3.1,"sat_accessibility":3.1,"sat_cleanliness":3.0,"sat_staff":2.6,"sat_language":2.9,"sat_overall":3.1,"gender_influence":"May be","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|36-45":{"count":5,"primary_mode":"Auto-Rikshaw","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.8,"sat_affordability":2.8,"sat_comfort":2.6,"sat_safety":2.8,"sat_accessibility":2.6,"sat_cleanliness":2.4,"sat_staff":2.2,"sat_language":2.6,"sat_overall":2.6,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|46-60":{"count":1,"primary_mode":"Rental Cab","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Flight","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Not Prefers","sat_availability":3.0,"sat_affordability":3.0,"sat_comfort":2.0,"sat_safety":2.0,"sat_accessibility":3.0,"sat_cleanliness":1.0,"sat_staff":1.0,"sat_language":3.0,"sat_overall":2.0,"gender_influence":"yes","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|18-25":{"count":13,"primary_mode":"City Bus","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Travel Time","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Regularly","sat_availability":2.3,"sat_affordability":2.6,"sat_comfort":2.3,"sat_safety":2.5,"sat_accessibility":2.6,"sat_cleanliness":1.8,"sat_staff":2.3,"sat_language":2.6,"sat_overall":2.2,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|26-35":{"count":55,"primary_mode":"Private Car","freq_mode":"Mixed Transport","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.9,"sat_affordability":3.2,"sat_comfort":2.5,"sat_safety":2.7,"sat_accessibility":2.9,"sat_cleanliness":2.4,"sat_staff":2.9,"sat_language":3.0,"sat_overall":2.7,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|36-45":{"count":7,"primary_mode":"Shared Taxi","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":1.7,"sat_affordability":1.7,"sat_comfort":2.0,"sat_safety":2.0,"sat_accessibility":2.3,"sat_cleanliness":2.6,"sat_staff":2.3,"sat_language":1.7,"sat_overall":2.0,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"Not Sure","sc_daily_pass":"No","sc_freq_increase":"No","sc_fare_comfort":"No","sc_mobile_app":"Not Sure","sc_5min_stops":"Not Sure","sc_clear_info":"No","sc_env_friendly":"No"},"Male|46-60":{"count":3,"primary_mode":"Auto-Rikshaw, Shared Taxi, Two-Wheeler, Walk/Cycle","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Cost, Availability","travel_time":"30-45 min","travel_cost":"50-100","use_pt":"Regularly","sat_availability":4.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":4.0,"sat_language":3.0,"sat_overall":3.0,"gender_influence":"May be","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Others|26-35":{"count":3,"primary_mode":"Rental Cab","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":5.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":3.0,"sat_language":4.0,"sat_overall":4.0,"gender_influence":"May be","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}},"gender_income":{"Female|25k-50k":{"count":3,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Travel Time","travel_time":"30-45 min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":3.0,"sat_affordability":3.0,"sat_comfort":2.0,"sat_safety":2.7,"sat_accessibility":2.7,"sat_cleanliness":2.0,"sat_staff":1.7,"sat_language":2.3,"sat_overall":2.3,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|50k-1L":{"count":3,"primary_mode":"Rental Cab, Two-Wheeler, Private Car","freq_mode":"Private Transport (Private Car ,Rented tourist traveler/cab/taxi/bike)","arrival_mode":"Flight","reason":"Cost, Comfort","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.7,"sat_affordability":3.7,"sat_comfort":3.7,"sat_safety":3.7,"sat_accessibility":3.7,"sat_cleanliness":3.7,"sat_staff":3.3,"sat_language":3.3,"sat_overall":3.7,"gender_influence":"May be","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|<25k":{"count":12,"primary_mode":"Two-Wheeler","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Travel Time, Comfort, Safety, Availability","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.3,"sat_affordability":3.4,"sat_comfort":3.3,"sat_safety":3.5,"sat_accessibility":3.2,"sat_cleanliness":3.3,"sat_staff":3.4,"sat_language":3.5,"sat_overall":3.5,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Female|>1L":{"count":6,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Comfort","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":1.3,"sat_affordability":1.8,"sat_comfort":1.2,"sat_safety":1.7,"sat_accessibility":1.8,"sat_cleanliness":1.5,"sat_staff":1.0,"sat_language":1.8,"sat_overall":1.7,"gender_influence":"yes","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|25k-50k":{"count":21,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.0,"sat_affordability":3.4,"sat_comfort":2.7,"sat_safety":2.8,"sat_accessibility":3.0,"sat_cleanliness":2.8,"sat_staff":2.9,"sat_language":3.0,"sat_overall":2.9,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|50k-1L":{"count":14,"primary_mode":"City Bus, Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"15-30 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.2,"sat_affordability":2.6,"sat_comfort":2.0,"sat_safety":2.2,"sat_accessibility":2.5,"sat_cleanliness":2.2,"sat_staff":2.7,"sat_language":2.2,"sat_overall":2.3,"gender_influence":"May be","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|<25k":{"count":22,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Occasionaly","sat_availability":2.9,"sat_affordability":3.1,"sat_comfort":2.5,"sat_safety":2.9,"sat_accessibility":2.7,"sat_cleanliness":2.1,"sat_staff":2.9,"sat_language":3.0,"sat_overall":2.4,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male|>1L":{"count":10,"primary_mode":"Shared Taxi","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Regularly","sat_availability":2.4,"sat_affordability":2.2,"sat_comfort":2.4,"sat_safety":2.4,"sat_accessibility":2.8,"sat_cleanliness":2.2,"sat_staff":2.8,"sat_language":2.2,"sat_overall":2.4,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"No","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Others|50k-1L":{"count":3,"primary_mode":"Rental Cab","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":5.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":3.0,"sat_language":4.0,"sat_overall":4.0,"gender_influence":"May be","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}},"gender":{"Female":{"count":26,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Travel Time, Comfort, Safety, Availability","travel_time":">45min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":2.8,"sat_affordability":3.0,"sat_comfort":2.7,"sat_safety":3.0,"sat_accessibility":2.7,"sat_cleanliness":2.7,"sat_staff":2.5,"sat_language":2.8,"sat_overall":2.8,"gender_influence":"yes","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Male":{"count":78,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.7,"sat_affordability":3.0,"sat_comfort":2.4,"sat_safety":2.6,"sat_accessibility":2.8,"sat_cleanliness":2.3,"sat_staff":2.8,"sat_language":2.8,"sat_overall":2.6,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"Others":{"count":3,"primary_mode":"Rental Cab","freq_mode":"Mixed Transport","arrival_mode":"Flight","reason":"Safety","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":5.0,"sat_affordability":4.0,"sat_comfort":3.0,"sat_safety":3.0,"sat_accessibility":4.0,"sat_cleanliness":3.0,"sat_staff":3.0,"sat_language":4.0,"sat_overall":4.0,"gender_influence":"May be","pt_safe_gender":"Unsafe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}},"age":{"18-25":{"count":25,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost","travel_time":"15-30 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.5,"sat_affordability":2.8,"sat_comfort":2.6,"sat_safety":2.7,"sat_accessibility":2.5,"sat_cleanliness":2.3,"sat_staff":2.5,"sat_language":2.7,"sat_overall":2.5,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"26-35":{"count":66,"primary_mode":"Rental Cab","freq_mode":"Mixed Transport","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.0,"sat_affordability":3.2,"sat_comfort":2.5,"sat_safety":2.8,"sat_accessibility":3.0,"sat_cleanliness":2.5,"sat_staff":2.8,"sat_language":3.0,"sat_overall":2.8,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"36-45":{"count":12,"primary_mode":"Auto-Rikshaw","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":">45min","travel_cost":"100-150","use_pt":"Occasionaly","sat_availability":2.2,"sat_affordability":2.2,"sat_comfort":2.2,"sat_safety":2.3,"sat_accessibility":2.4,"sat_cleanliness":2.5,"sat_staff":2.2,"sat_language":2.1,"sat_overall":2.2,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"No","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"46-60":{"count":4,"primary_mode":"Auto-Rikshaw, Shared Taxi, Two-Wheeler, Walk/Cycle","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Cost, Availability","travel_time":"30-45 min","travel_cost":"50-100","use_pt":"Regularly","sat_availability":3.8,"sat_affordability":3.8,"sat_comfort":2.8,"sat_safety":2.8,"sat_accessibility":3.8,"sat_cleanliness":2.5,"sat_staff":3.2,"sat_language":3.0,"sat_overall":2.8,"gender_influence":"May be","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}},"income":{"25k-50k":{"count":24,"primary_mode":"Private Car","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":3.0,"sat_affordability":3.4,"sat_comfort":2.6,"sat_safety":2.8,"sat_accessibility":3.0,"sat_cleanliness":2.7,"sat_staff":2.7,"sat_language":3.0,"sat_overall":2.8,"gender_influence":"no","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"50k-1L":{"count":20,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Cost, Availability","travel_time":">45min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.8,"sat_affordability":3.0,"sat_comfort":2.4,"sat_safety":2.6,"sat_accessibility":3.0,"sat_cleanliness":2.6,"sat_staff":2.9,"sat_language":2.7,"sat_overall":2.8,"gender_influence":"May be","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},"<25k":{"count":34,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Train","reason":"Cost, Availability","travel_time":"15-30 min","travel_cost":"50-100","use_pt":"Occasionaly","sat_availability":3.0,"sat_affordability":3.2,"sat_comfort":2.8,"sat_safety":3.1,"sat_accessibility":2.9,"sat_cleanliness":2.6,"sat_staff":3.1,"sat_language":3.2,"sat_overall":2.8,"gender_influence":"yes","pt_safe_gender":"Safe","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"},">1L":{"count":16,"primary_mode":"Rental Cab","freq_mode":"Public Transport (City bus,Auto,e-rikshaw,tamtam,sharing cab or taxi)","arrival_mode":"Flight","reason":"Comfort","travel_time":"30-45 min","travel_cost":">150","use_pt":"Occasionaly","sat_availability":2.0,"sat_affordability":2.1,"sat_comfort":1.9,"sat_safety":2.1,"sat_accessibility":2.4,"sat_cleanliness":1.9,"sat_staff":2.1,"sat_language":2.1,"sat_overall":2.1,"gender_influence":"no","pt_safe_gender":"Neutral","sc_single_route":"yes","sc_daily_pass":"yes","sc_freq_increase":"yes","sc_fare_comfort":"yes","sc_mobile_app":"yes","sc_5min_stops":"yes","sc_clear_info":"yes","sc_env_friendly":"yes"}}};

const SUGGESTIONS = {"by_gender":{"Female":["There must be public transport regulated by rules.","Safety, tracking, food","Want improvement in bus travel","Cleaning and safety","Nice experience, roads are not up to mark, cleanliness is required.","Cleanliness, theft, toilet","Actual price recommended","Pink buses should be available for every tourist place","Maintain hygiene","One Mobile app tracking system for public transport, hotels, private cars, restaurants","Need more option for rental cab and bikes","Online services available on time"],"Male":["Road should be better and cost should be in limit","Number of buses to be increased. Bus fares should be fixed. Flexibility to pay via UPI.","Need more managed PT network","Better facilities for solo travellers, safety concerns.","More tourist friendly","Public transport should be affordable, safe, hygienic and accountable","Easily available and cost effective","Should make more comfortable and fair prices","Improve the cleanliness and comfort level of public transport","Focus on Clearance and add a lady conductor so women feel safe","Proper Govt monitoring and safety rules for public transports","Low-cost, high-impact changes boost satisfaction","Increase more transportation services","Remove fuel based transport within city, replace with EV/cycle","Improve security, availability and frequency. Proper timetable and route maps.","Increase frequency in peak days"],"Others":["No civic sense available"]},"by_income":{"25k-50k":["Cleanliness, comfortable, gathering free","Public transport should be affordable, safe, hygienic and accountable","Increase more transportation services","More comfort and reckless driving should be avoided","Improve security, availability and frequency","Improve the cleanliness and comfort level of public transport","Better facilities for solo travellers, safety concerns.","Need more option for rental cab and bikes","Increase frequency in peak days"],"50k-1L":["Increase availability and safety.","Easily available and cost effective","Cleanliness, theft, toilet","Public transport should be frequent and comfortable with low budget.","Need more managed PT network","More tourist friendly"],"<25k":["Safety, tracking, food","Need more IMT options other than auto.","Low-cost, high-impact changes boost satisfaction","Cleaning and safety","Availability of more transport","Need of more public transport facility","Actual price recommended","One Mobile app tracking system","Focus on Clearance and add a lady conductor","Online services available on time"],">1L":["Public transport regulated by rules.","Software and Govt control on public transportation","Pink buses should be available for every tourist place","Number of buses increased. Bus fares fixed. UPI payment.","Replace fuel transport with EV/cycle","Maintain hygiene"]},"by_age":{"18-25":["Safety, tracking, food","Public transport should be affordable, safe, hygienic and accountable","Road should be better and cost in limit","Cleaning and safety","Actual price recommended","One Mobile app tracking system","Focus on Clearance and add a lady conductor","Online services available on time"],"26-35":["Number of buses increased. Bus fares fixed. UPI payment.","Better facilities for solo travellers, safety concerns.","More tourist friendly","Increase availability and safety.","Easily available and cost effective","Improve cleanliness and comfort level","Increase more transportation services","More comfort and reckless driving should be avoided","Improve security, availability and frequency","Increase frequency in peak days"],"36-45":["Nice experience, roads not up to mark, cleanliness required.","Cleanliness, theft, toilet","Software and Govt control on public transportation","Pink buses for every tourist place","Proper Govt monitoring and safety rules"],"46-60":["Public transport regulated by rules.","Need more managed PT network"]}};

const GENDERS = ["Male", "Female", "Others"];
const AGES = ["18-25", "26-35", "36-45", "46-60"];
const INCOMES = ["<25k", "25k-50k", "50k-1L", ">1L"];

function lookup(gender, age, income) {
  const exactKey = `${gender}|${age}|${income}`;
  if (LOOKUP.exact[exactKey]) return { data: LOOKUP.exact[exactKey], match: "exact", n: LOOKUP.exact[exactKey].count };

  const gaKey = `${gender}|${age}`;
  if (LOOKUP.gender_age[gaKey]) return { data: LOOKUP.gender_age[gaKey], match: "gender+age", n: LOOKUP.gender_age[gaKey].count };

  const giKey = `${gender}|${income}`;
  if (LOOKUP.gender_income[giKey]) return { data: LOOKUP.gender_income[giKey], match: "gender+income", n: LOOKUP.gender_income[giKey].count };

  const aiKey = `${age}|${income}`;
  if (LOOKUP.age_income && LOOKUP.age_income[aiKey]) return { data: LOOKUP.age_income[aiKey], match: "age+income", n: LOOKUP.age_income[aiKey].count };

  if (LOOKUP.gender[gender]) return { data: LOOKUP.gender[gender], match: "gender", n: LOOKUP.gender[gender].count };
  if (LOOKUP.age[age]) return { data: LOOKUP.age[age], match: "age", n: LOOKUP.age[age].count };
  if (LOOKUP.income[income]) return { data: LOOKUP.income[income], match: "income", n: LOOKUP.income[income].count };

  return null;
}

function getSuggestions(gender, age, income) {
  const pool = new Set();
  (SUGGESTIONS.by_gender[gender] || []).forEach(s => pool.add(s));
  (SUGGESTIONS.by_age[age] || []).forEach(s => pool.add(s));
  (SUGGESTIONS.by_income[income] || []).forEach(s => pool.add(s));
  return [...pool].slice(0, 6);
}

function StarRating({ value, label }) {
  const v = Math.round(value * 10) / 10;
  const pct = (v / 5) * 100;
  const tier = v >= 3.5 ? "good" : v >= 2.5 ? "mid" : "bad";
  return (
    <div className="star-row">
      <div className="star-label">{label}</div>
      <div className="star-track">
        <div className={`star-fill ${tier}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={`star-score ${tier}`}>{v}</div>
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  return (
    <span className={`badge badge-${variant}`}>{children}</span>
  );
}

function scenarioVariant(val) {
  if (!val) return "neutral";
  const v = val.toLowerCase();
  if (v === "yes") return "yes";
  if (v === "no") return "no";
  return "neutral";
}

function formatMode(mode) {
  if (!mode) return "—";
  return mode.replace(/City Bus/g, "Bus").replace(/Rental Cab/g, "Cab").replace(/Auto-Rikshaw/g, "Auto").replace(/Two-Wheeler/g, "2W").replace(/Walk\/Cycle/g, "Walk").replace(/Private Car/g, "Car").replace(/Shared Taxi/g, "Shared");
}

function formatFreqMode(mode) {
  if (!mode) return "—";
  if (mode.includes("Public")) return "Public Transport";
  if (mode.includes("Private")) return "Private Transport";
  if (mode.includes("Mixed")) return "Mixed Transport";
  return mode;
}

export default function App() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef(null);

  const handlePredict = () => {
    if (!gender || !age || !income) return;
    const r = lookup(gender, age, income);
    setResult(r);
    setShowResult(true);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleReset = () => {
    setGender("");
    setAge("");
    setIncome("");
    setResult(null);
    setShowResult(false);
  };

  const allSelected = gender && age && income;
  const selectedCount = [gender, age, income].filter(Boolean).length;

  return (
    <div className="predictor-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="predictor-header">
        <div className="predictor-header-inner">
          <div className="predictor-eyebrow">
            <span className="eyebrow-dot" />
            Tourist Transport Analytics
          </div>
          <h1 className="predictor-title">Mode Choice Predictor</h1>
          <p className="predictor-subtitle">
            Predictive interface based on 107 tourist survey responses — enter demographics to generate behavioral insights
          </p>
          <div className="predictor-stats">
            <div className="stat-item">
              <span className="stat-value">107</span>
              <span className="stat-label">Respondents</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">Satisfaction Metrics</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">Scenario Responses</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="predictor-main">

        {/* Input Card */}
        <div className="input-card">
          <div className="input-card-header">
            <span className="input-card-title">Input Parameters</span>
            <div className="input-progress">
              {[0, 1, 2].map(i => (
                <div key={i} className={`progress-pip${i < selectedCount ? " filled" : ""}`} />
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="param-group">
            <label className="param-label">Gender</label>
            <div className="segment-control">
              {GENDERS.map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`segment-btn${gender === g ? " active" : ""}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="param-group">
            <label className="param-label">Age Group (yrs)</label>
            <div className="segment-control">
              {AGES.map(a => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`segment-btn${age === a ? " active" : ""}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Income */}
          <div className="param-group">
            <label className="param-label">Monthly Income (INR)</label>
            <div className="segment-control">
              {INCOMES.map(i => (
                <button
                  key={i}
                  onClick={() => setIncome(i)}
                  className={`segment-btn${income === i ? " active" : ""}`}
                >
                  {i === "<25k" ? "< ₹25K" : i === "25k-50k" ? "₹25K–50K" : i === "50k-1L" ? "₹50K–1L" : "> ₹1L"}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button onClick={handlePredict} disabled={!allSelected} className="btn-primary">
              Generate Prediction
            </button>
            {showResult && (
              <button onClick={handleReset} className="btn-ghost">Reset</button>
            )}
          </div>
        </div>

        {/* Results */}
        {showResult && result && (
          <div ref={resultRef} className="results-container">

            {/* Match banner */}
            <div className="match-banner">
              <div className="match-dot" />
              <span className="match-text">
                Match: {result.match} · Based on {result.n} respondent{result.n > 1 ? "s" : ""}
              </span>
            </div>

            {/* Mode Choice */}
            <div className="result-card card-amber">
              <div className="section-label amber">
                <span className="section-icon amber">🚌</span>
                Mode Choice Behavior
              </div>
              <div className="data-grid">
                {[
                  ["Primary Mode", formatMode(result.data.primary_mode), false],
                  ["Most Frequent Mode", formatFreqMode(result.data.freq_mode), false],
                  ["Arrival Mode", result.data.arrival_mode, false],
                  ["Travel Cost / Trip (₹)", result.data.travel_cost, false],
                  ["Travel Time / Trip", result.data.travel_time, false],
                  ["Reason for Choice", result.data.reason, true],
                ].map(([label, value, span2], idx) => (
                  <div key={idx} className={`data-cell${span2 ? " span-2" : ""}`}>
                    <div className="data-cell-label">{label}</div>
                    <div className="data-cell-value">{value || "—"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction */}
            <div className="result-card card-green">
              <div className="section-label green">
                <span className="section-icon green">⭐</span>
                Public Transport Satisfaction
              </div>
              <div className="satisfaction-meta">
                <span className="pt-label">Public Transport Usage</span>
                <span className={`pt-value ${result.data.use_pt === "Regularly" ? "regularly" : result.data.use_pt === "Not Prefers" ? "not-prefers" : "other"}`}>
                  {result.data.use_pt}
                </span>
              </div>
              <div className="ratings-sublabel">Satisfaction Ratings (1–5 scale)</div>
              <StarRating value={result.data.sat_availability} label="Availability" />
              <StarRating value={result.data.sat_affordability} label="Affordability" />
              <StarRating value={result.data.sat_comfort} label="Comfort" />
              <StarRating value={result.data.sat_safety} label="Safety" />
              <StarRating value={result.data.sat_accessibility} label="Accessibility" />
              <StarRating value={result.data.sat_cleanliness} label="Cleanliness" />
              <StarRating value={result.data.sat_staff} label="Staff Behavior" />
              <StarRating value={result.data.sat_language} label="Language / Signage" />
              <div className="card-divider" />
              <StarRating value={result.data.sat_overall} label="Overall" />
            </div>

            {/* Gender Behavior */}
            <div className="result-card card-purple">
              <div className="section-label purple">
                <span className="section-icon purple">👤</span>
                Gender-Based Travel Behavior
              </div>
              <div className="data-grid">
                <div className="data-cell">
                  <div className="data-cell-label">Gender influences mode choice?</div>
                  <div style={{ marginTop: 8 }}>
                    <Badge variant={result.data.gender_influence === "yes" ? "yes" : result.data.gender_influence === "no" ? "no" : "neutral"}>
                      {result.data.gender_influence === "yes" ? "Yes" : result.data.gender_influence === "no" ? "No" : "Maybe"}
                    </Badge>
                  </div>
                </div>
                <div className="data-cell">
                  <div className="data-cell-label">PT safe for this gender?</div>
                  <div style={{ marginTop: 8 }}>
                    <Badge variant={result.data.pt_safe_gender === "Very Safe" || result.data.pt_safe_gender === "Safe" ? "yes" : result.data.pt_safe_gender === "Unsafe" ? "no" : "neutral"}>
                      {result.data.pt_safe_gender}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios + Suggestions */}
            <div className="result-card card-pink">
              <div className="section-label pink">
                <span className="section-icon pink">💡</span>
                Scenario Responses &amp; Suggestions
              </div>
              <div className="ratings-sublabel">Would you prefer PT if…</div>
              <div className="scenario-list">
                {[
                  ["Tourist attractions connected by single route", result.data.sc_single_route],
                  ["₹100–150 daily unlimited pass available", result.data.sc_daily_pass],
                  ["Frequency increased by 50%", result.data.sc_freq_increase],
                  ["Fares +20% but comfort improved", result.data.sc_fare_comfort],
                  ["Mobile app with live tracking", result.data.sc_mobile_app],
                  ["Stops within 5 min walking", result.data.sc_5min_stops],
                  ["Clear tourist info (routes / maps / schedules)", result.data.sc_clear_info],
                  ["Promoted as eco-friendly option", result.data.sc_env_friendly],
                ].map(([scenario, val], idx) => (
                  <div key={idx} className="scenario-row">
                    <span className="scenario-text">{scenario}</span>
                    <Badge variant={scenarioVariant(val)}>
                      {val === "yes" ? "Yes" : val === "No" ? "No" : val || "—"}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="suggestions-section">
                <div className="suggestions-label">Likely Suggestions for Improvement</div>
                {getSuggestions(gender, age, income).map((s, idx) => (
                  <div key={idx} className="suggestion-item">{s}</div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
