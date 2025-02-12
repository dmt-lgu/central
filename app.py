import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# Load CSV file
uploaded_file = st.file_uploader("Upload your CSV file", type="csv")
if uploaded_file:
    data = pd.read_csv(uploaded_file)
    
    # Convert 'date' column to datetime
    data['date'] = pd.to_datetime(data['date'], format='%Y-%m')

    # Extract unique dates
    available_dates = sorted(data['date'].dt.strftime('%Y-%m').unique(), reverse=True)

    # Dropdown menu for selecting date
    selected_date = st.selectbox("Select a date for the report", available_dates)

    # Filter data based on the selected date
    latest_data = data[data['date'] == pd.to_datetime(selected_date)]

    # Display the latest report for each region
    st.markdown(f"## 📅 Report as of {selected_date}")
    for index, row in latest_data.iterrows():
        st.markdown(f"""
        ### {row['region']} Region
        - **{row['operational']}** Operational Cases
        - **{row['development']}** Developmental Cases
        - **{row['trainingOrOthers']}** Training or Other Activities
        - **{row['withdraw']}** Withdrawals
        """)

    # Calculate total cases for each region
    latest_data['Total Cases'] = latest_data[['operational', 'development', 'trainingOrOthers', 'withdraw']].sum(axis=1)
    
    # Rank regions by operational value
    ranked_regions = latest_data.sort_values(by='operational', ascending=False).reset_index(drop=True)
    ranked_regions.index = ranked_regions.index + 1
    st.markdown("## 🥇 Regional Rankings by Operational Value")
    st.dataframe(ranked_regions[['region', 'operational']])

    # Advanced Analytics
    st.markdown("## 📊 Advanced Analytics")
    
    # Total Cases Analysis
    total_cases = latest_data['Total Cases'].sum()
    st.markdown(f"**Total Cases Across All Regions (as of {selected_date}):** {total_cases}")
    
    # Calculate growth rate compared to the previous month
    previous_month = pd.to_datetime(selected_date) - pd.DateOffset(months=1)
    prev_data = data[data['date'] == previous_month]
    
    if not prev_data.empty:
        prev_total = prev_data['operational'].sum()
        growth_rate = ((latest_data['operational'].sum() - prev_total) / prev_total) * 100
        st.markdown(f"**Growth Rate in Operational Cases (compared to {previous_month.strftime('%Y-%m')}):** {growth_rate:.2f}%")

    # Top Performing Region
    top_region = ranked_regions.iloc[0]
    st.markdown(f"🏆 **Top Region:** {top_region['region']} with {top_region['operational']} operational cases")

    # Radar Chart with hoverable values for all types
    st.markdown("## 🕸️ Radar Chart Analysis by Case Type")
    radar_fig = go.Figure()
    for case_type in ['operational', 'development', 'trainingOrOthers', 'withdraw']:
        radar_fig.add_trace(go.Scatterpolar(
            r=latest_data[case_type],
            theta=latest_data['region'],
            fill='toself',
            name=case_type.capitalize()
        ))
    radar_fig.update_layout(
        polar=dict(radialaxis=dict(visible=True)),
        title=f"Comparison of All Case Types by Region (as of {selected_date})"
    )
    st.plotly_chart(radar_fig)

    # Line Chart for trends over time for each case type
    st.markdown("## 📉 Trends Over Time for Each Case Type")
    for case_type in ['operational', 'development', 'trainingOrOthers', 'withdraw']:
        line_fig = px.line(data, x='date', y=case_type, color='region',
                           title=f"{case_type.capitalize()} Cases Over Time",
                           markers=True)
        st.plotly_chart(line_fig)

    # Bar Chart for each case type
    st.markdown("## 📊 Bar Chart Comparison by Case Type")
    for case_type in ['operational', 'development', 'trainingOrOthers', 'withdraw']:
        bar_fig = px.bar(latest_data, x='region', y=case_type,
                         color=case_type, title=f"{case_type.capitalize()} Cases by Region",
                         text=case_type)
        bar_fig.update_layout(xaxis_title="Region", yaxis_title=f"{case_type.capitalize()} Cases")
        st.plotly_chart(bar_fig)

    # Pie Chart for each case type distribution
    st.markdown("## 🥧 Distribution of Cases by Type")
    for case_type in ['operational', 'development', 'trainingOrOthers', 'withdraw']:
        pie_fig = px.pie(latest_data, values=case_type, names='region',
                         title=f"{case_type.capitalize()} Case Distribution (as of {selected_date})")
        st.plotly_chart(pie_fig)


# streamlit run app.py
